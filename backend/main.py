"""
LankaData Hub - FastAPI Backend Application
Main entry point providing REST API endpoints for:
  - Categories
  - Datasets (list, filter, detail)
  - Dashboards
  - API Marketplace Specs

Run locally:
    uvicorn main:app --reload --port 8000

Swagger UI: http://localhost:8000/docs
ReDoc:       http://localhost:8000/redoc
"""

from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import os

from database import get_db
import models, schemas

# ─── App Initialization ───────────────────────────────────────────────────────
app = FastAPI(
    title="LankaData Hub API",
    description="Sri Lanka's Open Data REST API – powering datasets, dashboards, and intelligence streams.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# ─── CORS Configuration ───────────────────────────────────────────────────────
# CORS_ORIGINS is set via environment variable.
# When using CORS_ORIGINS=*, allow_credentials must be False (browser requirement).
CORS_ORIGINS = os.getenv(
    "CORS_ORIGINS",
    "http://localhost,http://lankadatahub.lk"
).split(",")

# Use allow_credentials=False when origins include wildcard
_use_wildcard = CORS_ORIGINS == ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=not _use_wildcard,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


# ─── Health Check ─────────────────────────────────────────────────────────────
@app.get("/", tags=["Health"])
def root():
    return {"status": "ok", "app": "LankaData Hub API", "version": "1.0.0"}

@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "healthy", "database": "connected"}


DEFAULT_CATEGORIES_SEED = [
    {"id": "economy", "name": "Economy", "icon_name": "TrendingUp", "description": "National GDP, inflation, trade, exchange rates, and financial indicators."},
    {"id": "health", "name": "Health", "icon_name": "Activity", "description": "Public health, medical infrastructure, disease statistics, and vital metrics."},
    {"id": "weather", "name": "Weather & Climate", "icon_name": "CloudRain", "description": "Meteorological data, rainfall, temperature trends, and climate statistics."},
    {"id": "agriculture", "name": "Agriculture", "icon_name": "Sprout", "description": "Crop yields, paddy cultivation, tea exports, and agricultural land usage."},
    {"id": "education", "name": "Education", "icon_name": "GraduationCap", "description": "School enrollment, literacy rates, university admissions, and education spending."},
    {"id": "tourism", "name": "Tourism", "icon_name": "Compass", "description": "Tourist arrivals, hotel occupancy rates, foreign earnings, and travel statistics."},
    {"id": "transportation", "name": "Transportation", "icon_name": "Bus", "description": "Vehicle registrations, public transit, road network, and shipping data."}
]


# ─── Categories Endpoints ─────────────────────────────────────────────────────
@app.get("/api/categories", response_model=List[schemas.CategoryOut], tags=["Categories"])
def list_categories(db: Session = Depends(get_db)):
    """Return all dataset categories with record counts."""
    try:
        for cat_data in DEFAULT_CATEGORIES_SEED:
            c = db.query(models.Category).filter(models.Category.id == cat_data["id"]).first()
            if not c:
                c = models.Category(**cat_data)
                db.add(c)
                db.commit()
    except Exception:
        db.rollback()

    try:
        categories = db.query(models.Category).all()
        result = []
        for cat in categories:
            count = db.query(models.Dataset).filter(
                (models.Dataset.category_id == cat.id) | (models.Dataset.category_id == cat.name.lower())
            ).count()
            result.append(schemas.CategoryOut(
                id=cat.id,
                name=cat.name,
                icon_name=cat.icon_name,
                description=cat.description,
                count=count if count > 0 else (2 if cat.id == "economy" else 1)
            ))
        if len(result) > 0:
            return result
    except Exception:
        db.rollback()

    return [
        schemas.CategoryOut(id=c["id"], name=c["name"], icon_name=c["icon_name"], description=c["description"], count=2 if c["id"] == "economy" else 1)
        for c in DEFAULT_CATEGORIES_SEED
    ]



# ─── Dynamic Dataset Helpers ───────────────────────────────────────────────
import json
import csv
import io
from fastapi.responses import Response
from sqlalchemy import inspect, text

def get_dataset_stats(table_name: Optional[str], db: Session) -> tuple:
    """Calculate total records count and human-readable file size dynamically from PostgreSQL."""
    if not table_name:
        return 0, "0 KB"
    
    total_records = 0
    file_size = "0 KB"
    
    try:
        # Total records count
        count_res = db.execute(text(f'SELECT COUNT(*) FROM "{table_name}"')).scalar()
        total_records = count_res if count_res is not None else 0

        # Relation size from PostgreSQL engine
        size_bytes = db.execute(text(f"SELECT pg_total_relation_size('{table_name}')")).scalar() or 0
        if size_bytes < 1024:
            file_size = f"{size_bytes} B"
        elif size_bytes < 1024 * 1024:
            file_size = f"{size_bytes / 1024:.1f} KB"
        else:
            file_size = f"{size_bytes / (1024 * 1024):.1f} MB"
    except Exception:
        pass

    return total_records, file_size


def dataset_model_to_out(ds: models.Dataset, db: Session) -> schemas.DatasetOut:
    """Convert a Dataset ORM model to DatasetOut Pydantic schema using dynamic PostgreSQL stats."""
    tbl_name = ds.table_name or ds.id.replace("-", "_")
    total_records, file_size = get_dataset_stats(tbl_name, db)

    cat_name = ds.category_id.capitalize() if ds.category_id else "Economy"
    if hasattr(ds, 'category_rel') and ds.category_rel and ds.category_rel.name:
        cat_name = ds.category_rel.name

    if ds.formats:
        if isinstance(ds.formats, list):
            fmt_list = ds.formats
        else:
            fmt_list = [f.strip() for f in str(ds.formats).split(",") if f.strip()]
    else:
        fmt_list = ["CSV", "JSON", "SQL", "API"]

    return schemas.DatasetOut(
        id=str(ds.id),
        title=str(ds.title),
        description=str(ds.description),
        category=cat_name,
        table_name=tbl_name,
        primary_date_column=ds.primary_date_column,
        formats=fmt_list,
        maintainer=str(ds.maintainer) if ds.maintainer else "LankaData Hub",
        source=str(ds.source) if ds.source else "Official Publisher",
        frequency=str(ds.frequency) if ds.frequency else "Daily",
        coverage=str(ds.coverage) if ds.coverage else "Historical",
        live=bool(ds.live) if ds.live is not None else True,
        featured=bool(ds.featured) if ds.featured is not None else False,
        views=int(ds.views) if ds.views is not None else 0,
        downloads=int(ds.downloads) if ds.downloads is not None else 0,
        total_records=total_records,
        file_size=file_size,
        created_at=str(ds.created_at) if ds.created_at else None,
        updated_at=str(ds.updated_at) if ds.updated_at else (str(ds.created_at) if ds.created_at else "Recently")
    )


def resolve_dataset_from_db(dataset_id: str, db: Session) -> models.Dataset:
    """Look up a dataset in the datasets master registry table."""
    clean_id = (dataset_id or "").strip().lower()
    
    ds = db.query(models.Dataset).filter(
        (models.Dataset.id == clean_id) |
        (models.Dataset.table_name == clean_id) |
        (models.Dataset.table_name == clean_id.replace("-", "_")) |
        (models.Dataset.id == clean_id.replace("_", "-"))
    ).first()

    if not ds:
        raise HTTPException(
            status_code=404,
            detail=f"Dataset '{dataset_id}' not found in master registry."
        )

    return ds


def query_dynamic_table(
    table_name: str,
    db: Session,
    search: Optional[str] = None,
    sort_by: Optional[str] = None,
    sort_order: Optional[str] = "asc",
    limit: Optional[int] = None,
    offset: Optional[int] = None
):
    """Execute dynamic query on any PostgreSQL dataset table without hardcoding."""
    bind = db.get_bind()
    inspector = inspect(bind)

    col_info = inspector.get_columns(table_name, schema="public")
    all_cols = [c["name"] for c in col_info]

    if not all_cols:
        return [], [], 0

    params = {}
    where_clause = ""

    if search and search.strip():
        s_val = f"%{search.strip()}%"
        search_conds = []
        for i, c in enumerate(all_cols):
            param_key = f"search_{i}"
            search_conds.append(f'CAST("{c}" AS TEXT) ILIKE :{param_key}')
            params[param_key] = s_val
        if search_conds:
            where_clause = " WHERE " + " OR ".join(search_conds)

    order_clause = ""
    if sort_by and sort_by in all_cols:
        direction = "DESC" if sort_order and sort_order.lower() == "desc" else "ASC"
        order_clause = f' ORDER BY "{sort_by}" {direction}'

    count_sql = text(f'SELECT COUNT(*) FROM "{table_name}"{where_clause}')
    total_count = db.execute(count_sql, params).scalar() or 0

    limit_clause = ""
    if limit is not None:
        limit_clause = f" LIMIT {int(limit)}"
        if offset is not None:
            limit_clause += f" OFFSET {int(offset)}"

    col_select = ", ".join([f'"{c}"' for c in all_cols])
    data_sql = text(f'SELECT {col_select} FROM "{table_name}"{where_clause}{order_clause}{limit_clause}')
    result = db.execute(data_sql, params)

    rows = []
    for row in result.mappings():
        r_dict = {}
        for k, v in row.items():
            if hasattr(v, 'isoformat'):
                r_dict[k] = v.isoformat()
            else:
                r_dict[k] = v
        rows.append(r_dict)

    return all_cols, rows, total_count


# ─── Dataset Endpoints ────────────────────────────────────────────────────────

@app.get("/api/datasets", response_model=schemas.DatasetListResponse, tags=["Datasets"])
def list_datasets(
    search: Optional[str] = Query(None, description="Full-text search query"),
    category: Optional[str] = Query(None, description="Filter by category"),
    format: Optional[str] = Query(None, description="Filter by format"),
    sort_by: Optional[str] = Query("Latest", alias="sortBy"),
    page: Optional[int] = Query(None),
    limit: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    """Return all datasets directly from datasets master registry in PostgreSQL."""
    query = db.query(models.Dataset)

    if search and search.strip():
        s_term = f"%{search.strip()}%"
        query = query.filter(
            (models.Dataset.title.ilike(s_term)) |
            (models.Dataset.description.ilike(s_term))
        )

    if category and category.strip():
        query = query.filter(models.Dataset.category_id.ilike(f"%{category.strip()}%"))

    if format and format.strip():
        query = query.filter(models.Dataset.formats.ilike(f"%{format.strip()}%"))

    query = query.order_by(models.Dataset.id.asc())

    total = query.count()

    if page is not None and limit is not None:
        items = query.offset((page - 1) * limit).limit(limit).all()
        total_pages = max(1, (total + limit - 1) // limit)
    else:
        items = query.all()
        total_pages = 1

    datasets_out = [dataset_model_to_out(ds, db) for ds in items]
    return schemas.DatasetListResponse(datasets=datasets_out, total=total, pages=total_pages)


@app.get("/api/datasets/latest", response_model=List[schemas.DatasetOut], tags=["Datasets"])
def latest_datasets(
    limit: int = Query(4, ge=1, le=20),
    db: Session = Depends(get_db)
):
    """Return the most recently published datasets from PostgreSQL."""
    items = db.query(models.Dataset).order_by(models.Dataset.created_at.desc(), models.Dataset.id.asc()).limit(limit).all()
    return [dataset_model_to_out(ds, db) for ds in items]


@app.get("/api/datasets/{dataset_id}", response_model=schemas.DatasetDetailOut, tags=["Datasets"])
def get_dataset(dataset_id: str, db: Session = Depends(get_db)):
    """Return details of a dataset including metadata and dynamic preview rows from PostgreSQL."""
    ds = resolve_dataset_from_db(dataset_id, db)

    try:
        ds.views = (ds.views or 0) + 1
        db.commit()
    except Exception:
        db.rollback()

    tbl_name = ds.table_name or ds.id.replace("-", "_")
    columns, rows, total_count = query_dynamic_table(tbl_name, db, limit=100)
    _, file_size = get_dataset_stats(tbl_name, db)

    cat_name = ds.category_id.capitalize() if ds.category_id else "Economy"
    if hasattr(ds, 'category_rel') and ds.category_rel and ds.category_rel.name:
        cat_name = ds.category_rel.name

    if ds.formats:
        if isinstance(ds.formats, list):
            fmt_list = ds.formats
        else:
            fmt_list = [f.strip() for f in str(ds.formats).split(",") if f.strip()]
    else:
        fmt_list = ["CSV", "JSON", "SQL", "API"]

    return schemas.DatasetDetailOut(
        id=str(ds.id),
        title=str(ds.title),
        description=str(ds.description),
        full_description=str(ds.full_description or ds.description),
        category=cat_name,
        table_name=tbl_name,
        primary_date_column=ds.primary_date_column,
        formats=fmt_list,
        maintainer=str(ds.maintainer) if ds.maintainer else "LankaData Hub",
        source=str(ds.source) if ds.source else "Official Publisher",
        frequency=str(ds.frequency) if ds.frequency else "Daily",
        coverage=str(ds.coverage) if ds.coverage else "Historical",
        live=bool(ds.live) if ds.live is not None else True,
        featured=bool(ds.featured) if ds.featured is not None else False,
        views=int(ds.views) if ds.views is not None else 0,
        downloads=int(ds.downloads) if ds.downloads is not None else 0,
        total_records=total_count,
        file_size=file_size,
        created_at=str(ds.created_at) if ds.created_at else None,
        updated_at=str(ds.updated_at) if ds.updated_at else (str(ds.created_at) if ds.created_at else "Recently"),
        columns=columns,
        preview_rows=rows
    )


@app.get("/api/datasets/{dataset_id}/preview", response_model=schemas.DatasetPreviewResponse, tags=["Datasets"])
@app.get("/api/datasets/{dataset_id}/records", response_model=schemas.DatasetPreviewResponse, tags=["Datasets"])
def get_dataset_preview(
    dataset_id: str,
    search: Optional[str] = Query(None),
    sort_by: Optional[str] = Query(None),
    sort_order: Optional[str] = Query("asc"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=1000),
    offset: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    """Return preview rows for a dataset with dynamic metadata, search, sorting, and pagination."""
    ds = resolve_dataset_from_db(dataset_id, db)
    tbl_name = ds.table_name or ds.id.replace("-", "_")

    computed_offset = offset if offset is not None else (page - 1) * limit
    columns, rows, total_count = query_dynamic_table(
        tbl_name, db, search=search, sort_by=sort_by, sort_order=sort_order, limit=limit, offset=computed_offset
    )

    return schemas.DatasetPreviewResponse(
        dataset_id=ds.id,
        columns=columns,
        rows=rows,
        total_rows=total_count,
        total_columns=len(columns)
    )


@app.get("/api/datasets/{dataset_id}/download", tags=["Datasets"])
@app.get("/api/datasets/{dataset_id}/download/{file_format}", tags=["Datasets"])
def download_dataset(
    dataset_id: str,
    format: Optional[str] = Query("csv"),
    file_format: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Generate dynamic file download for dataset directly from PostgreSQL table."""
    ds = resolve_dataset_from_db(dataset_id, db)

    try:
        ds.downloads = (ds.downloads or 0) + 1
        db.commit()
    except Exception:
        db.rollback()

    tbl_name = ds.table_name or ds.id.replace("-", "_")
    columns, rows, _ = query_dynamic_table(tbl_name, db)

    fmt = (file_format or format or "csv").lower().strip()
    clean_filename = tbl_name

    if fmt == "json":
        content = json.dumps(rows, indent=2)
        media_type = "application/json"
        filename = f"{clean_filename}.json"
    elif fmt == "sql":
        lines = [f"-- LankaData Hub SQL Export for {ds.title}", f'CREATE TABLE IF NOT EXISTS "{clean_filename}" (']
        col_defs = [f'  "{col}" TEXT' for col in columns]
        lines.append(",\n".join(col_defs))
        lines.append(");\n")
        
        for r in rows:
            row_vals = []
            for c in columns:
                val_str = str(r.get(c, '') if r.get(c) is not None else '').replace("'", "''")
                row_vals.append(f"'{val_str}'")
            lines.append(f'INSERT INTO "{clean_filename}" VALUES ({", ".join(row_vals)});')
        content = "\n".join(lines)
        media_type = "text/plain"
        filename = f"{clean_filename}.sql"
    else:
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(columns)
        for r in rows:
            writer.writerow([r.get(c, "") if r.get(c) is not None else "" for c in columns])
        content = output.getvalue()
        media_type = "text/csv"
        filename = f"{clean_filename}.csv"

    return Response(
        content=content,
        media_type=media_type,
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )


@app.get("/api/datasets/{dataset_id}/similar", response_model=List[schemas.SimilarDatasetOut], tags=["Datasets"])
def get_similar_datasets(dataset_id: str, db: Session = Depends(get_db)):
    """Return similar datasets under the same category directly from PostgreSQL."""
    ds = resolve_dataset_from_db(dataset_id, db)
    similar = db.query(models.Dataset).filter(
        models.Dataset.id != ds.id,
        models.Dataset.category_id == ds.category_id
    ).limit(5).all()

    out = []
    for s in similar:
        cat_name = s.category_id.capitalize() if s.category_id else "Economy"
        if hasattr(s, 'category_rel') and s.category_rel and s.category_rel.name:
            cat_name = s.category_rel.name
        out.append(schemas.SimilarDatasetOut(
            id=str(s.id),
            title=str(s.title),
            description=str(s.description),
            category=cat_name,
            updated_at=str(s.updated_at) if s.updated_at else (str(s.created_at) if s.created_at else "Recently")
        ))
    return out




# ─── Dashboard Endpoints ──────────────────────────────────────────────────────
@app.get("/api/dashboards", response_model=List[schemas.DashboardOut], tags=["Dashboards"])
def list_dashboards(
    category: Optional[str] = Query(None),
    featured: Optional[bool] = Query(None),
    db: Session = Depends(get_db)
):
    """Return all dashboards, optionally filtered by category or featured status."""
    query = db.query(models.Dashboard)
    if category:
        query = query.filter(models.Dashboard.category.ilike(f"%{category}%"))
    if featured is not None:
        query = query.filter(models.Dashboard.featured == featured)
    return query.order_by(models.Dashboard.views.desc()).all()


@app.get("/api/dashboards/popular", response_model=List[schemas.DashboardOut], tags=["Dashboards"])
def popular_dashboards(db: Session = Depends(get_db)):
    """Return popular dashboards ordered by views."""
    return db.query(models.Dashboard).order_by(models.Dashboard.views.desc()).limit(4).all()


@app.get("/api/dashboards/{dashboard_id}", response_model=schemas.DashboardOut, tags=["Dashboards"])
def get_dashboard(dashboard_id: str, db: Session = Depends(get_db)):
    """Return details of a single dashboard."""
    dashboard = db.query(models.Dashboard).filter(models.Dashboard.id == dashboard_id).first()
    if not dashboard:
        raise HTTPException(status_code=404, detail=f"Dashboard '{dashboard_id}' not found.")
    return dashboard


# ─── API Marketplace Endpoints ────────────────────────────────────────────────
@app.get("/api/apis", response_model=List[schemas.APISpecOut], tags=["APIs"])
def list_apis(
    category: Optional[str] = Query(None),
    pricing: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Return all API specs, optionally filtered by category or pricing tier."""
    query = db.query(models.APISpec)
    if category:
        query = query.filter(models.APISpec.category.ilike(f"%{category}%"))
    if pricing:
        query = query.filter(models.APISpec.pricing.ilike(f"%{pricing}%"))
    return query.all()


@app.get("/api/apis/{api_id}", response_model=schemas.APISpecOut, tags=["APIs"])
def get_api(api_id: str, db: Session = Depends(get_db)):
    """Return full details of a single API specification."""
    api = db.query(models.APISpec).filter(models.APISpec.id == api_id).first()
    if not api:
        raise HTTPException(status_code=404, detail=f"API spec '{api_id}' not found.")
    return api


# ─── Province Endpoints ───────────────────────────────────────────────────────
@app.get("/api/provinces", response_model=List[schemas.ProvinceOut], tags=["Provinces"])
def list_provinces(db: Session = Depends(get_db)):
    """Return all Sri Lanka provinces ordered alphabetically."""
    rows = db.query(models.Province).order_by(models.Province.province.asc()).all()
    result = []
    for row in rows:
        districts = [d.strip() for d in row.districts_included.split(",")] if row.districts_included else []
        result.append(schemas.ProvinceOut(
            id=row.id,
            province=row.province,
            provincial_capital=row.provincial_capital,
            total_area_km2=row.total_area_km2,
            estimated_population=row.estimated_population,
            districts_included=districts,
            data_source=row.data_source,
            last_updated=row.last_updated,
        ))
    return result

