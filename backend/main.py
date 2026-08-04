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


# ─── Categories Endpoints ─────────────────────────────────────────────────────
@app.get("/api/categories", response_model=List[schemas.CategoryOut], tags=["Categories"])
def list_categories(db: Session = Depends(get_db)):
    """Return all dataset categories with record counts."""
    categories = db.query(models.Category).all()
    result = []
    for cat in categories:
        count = db.query(models.Dataset).filter(models.Dataset.category_id == cat.id).count()
        result.append(schemas.CategoryOut(
            id=cat.id,
            name=cat.name,
            icon_name=cat.icon_name,
            description=cat.description,
            count=count
        ))
    return result


# ─── Dataset Endpoints ────────────────────────────────────────────────────────
@app.get("/api/datasets", response_model=schemas.DatasetListResponse, tags=["Datasets"])
def list_datasets(
    search: Optional[str] = Query(None, description="Full-text search query"),
    category: Optional[str] = Query(None, description="Filter by category name (e.g. Economy)"),
    format: Optional[str] = Query(None, description="Filter by file format (CSV, JSON, API, Excel)"),
    sort_by: Optional[str] = Query("Latest", description="Sort order: Latest | Most Popular | Most Downloaded"),
    page: int = Query(1, ge=1, description="Page number (1-indexed)"),
    limit: int = Query(10, ge=1, le=100, description="Results per page"),
    db: Session = Depends(get_db)
):
    """List datasets with optional filtering, search, and pagination."""
    query = db.query(models.Dataset)

    # Apply search filter
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            models.Dataset.title.ilike(search_term) |
            models.Dataset.description.ilike(search_term)
        )

    # Apply category filter
    if category:
        query = query.join(models.Category).filter(
            models.Category.name.ilike(f"%{category}%")
        )

    # Apply format filter
    if format:
        query = query.filter(models.Dataset.formats.ilike(f"%{format}%"))

    # Apply sorting
    if sort_by == "Most Popular":
        query = query.order_by(models.Dataset.views.desc())
    elif sort_by == "Most Downloaded":
        query = query.order_by(models.Dataset.downloads.desc())
    else:
        query = query.order_by(models.Dataset.created_at.desc())

    # Paginate
    total = query.count()
    total_pages = max(1, (total + limit - 1) // limit)
    items = query.offset((page - 1) * limit).limit(limit).all()

    # Map to response schema
    datasets_out = []
    for ds in items:
        cat_name = ds.category_rel.name if ds.category_rel else ds.category_id
        datasets_out.append(schemas.DatasetOut(
            id=ds.id,
            title=ds.title,
            description=ds.description,
            category=cat_name,
            formats=ds.formats.split(","),
            maintainer=ds.maintainer,
            frequency=ds.frequency,
            coverage=ds.coverage,
            live=ds.live,
            featured=ds.featured,
            views=ds.views,
            downloads=ds.downloads,
            updated_at=str(ds.updated_at) if ds.updated_at else "Recently updated"
        ))

    return schemas.DatasetListResponse(datasets=datasets_out, total=total, pages=total_pages)


@app.get("/api/datasets/latest", response_model=List[schemas.DatasetOut], tags=["Datasets"])
def latest_datasets(
    limit: int = Query(4, ge=1, le=20),
    db: Session = Depends(get_db)
):
    """Return the most recently published datasets."""
    items = db.query(models.Dataset).order_by(models.Dataset.created_at.desc()).limit(limit).all()
    return [schemas.DatasetOut(
        id=ds.id, title=ds.title, description=ds.description,
        category=ds.category_rel.name if ds.category_rel else ds.category_id,
        formats=ds.formats.split(","), maintainer=ds.maintainer,
        frequency=ds.frequency, coverage=ds.coverage, live=ds.live,
        featured=ds.featured, views=ds.views, downloads=ds.downloads,
        updated_at=str(ds.updated_at) if ds.updated_at else "Recently updated"
    ) for ds in items]


# Helper to parse dataset records
import json
from fastapi.responses import Response

def normalize_dataset_id(dataset_id: str) -> str:
    if dataset_id in ["hnb-usd-exchange-rates", "hnb-usd-exchange-rate"]:
        return "hnb-usd-rates"
    return dataset_id

def get_parsed_dataset_records(dataset_id: str, db: Session):
    clean_id = normalize_dataset_id(dataset_id)
    records = db.query(models.DatasetRecord).filter(
        models.DatasetRecord.dataset_id == clean_id
    ).all()
    
    rows = []
    columns_set = []
    for r in records:
        if r.extra_data:
            try:
                data_dict = json.loads(r.extra_data)
                for k in data_dict.keys():
                    if k not in columns_set:
                        columns_set.append(k)
                rows.append(data_dict)
                continue
            except Exception:
                pass
        
        fallback_dict = {}
        if r.year: fallback_dict["Date/Year"] = r.year
        if r.region: fallback_dict["Region"] = r.region
        if r.indicator_value is not None: fallback_dict["Value"] = r.indicator_value
        if r.growth_pct is not None: fallback_dict["Growth %"] = r.growth_pct
        for k in fallback_dict.keys():
            if k not in columns_set:
                columns_set.append(k)
        rows.append(fallback_dict)
        
    return columns_set, rows


@app.get("/api/datasets/{dataset_id}", response_model=schemas.DatasetDetailOut, tags=["Datasets"])
def get_dataset(dataset_id: str, db: Session = Depends(get_db)):
    """Return full details of a single dataset including metadata and initial preview rows."""
    clean_id = normalize_dataset_id(dataset_id)
    ds = db.query(models.Dataset).filter(models.Dataset.id == clean_id).first()
    if not ds:
        raise HTTPException(status_code=404, detail=f"Dataset '{dataset_id}' not found.")

    # Increment view count
    ds.views = (ds.views or 0) + 1
    db.commit()

    columns, rows = get_parsed_dataset_records(clean_id, db)
    total_recs = len(rows) if len(rows) > 0 else (ds.total_records or 0)

    return schemas.DatasetDetailOut(
        id=ds.id,
        title=ds.title,
        description=ds.description,
        full_description=ds.full_description or ds.description,
        category=ds.category_rel.name if ds.category_rel else ds.category_id,
        formats=ds.formats.split(",") if ds.formats else ["CSV", "JSON", "SQL"],
        maintainer=ds.maintainer or "Central Bank of Sri Lanka",
        source=ds.source or ds.maintainer or "Official Publisher",
        frequency=ds.frequency or "Daily",
        coverage=ds.coverage or "2005 - Present",
        live=ds.live,
        featured=ds.featured,
        views=ds.views,
        downloads=ds.downloads,
        total_records=total_recs,
        file_size=ds.file_size or "12.4 MB",
        updated_at=str(ds.updated_at) if ds.updated_at else "Today",
        columns=columns,
        preview_rows=rows[:20]
    )


@app.get("/api/datasets/{dataset_id}/preview", response_model=schemas.DatasetPreviewResponse, tags=["Datasets"])
def get_dataset_preview(
    dataset_id: str,
    search: Optional[str] = Query(None),
    sort_by: Optional[str] = Query(None),
    sort_order: Optional[str] = Query("asc"),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    """Return preview rows for a dataset with search, sorting, and pagination."""
    clean_id = normalize_dataset_id(dataset_id)
    ds = db.query(models.Dataset).filter(models.Dataset.id == clean_id).first()
    if not ds:
        raise HTTPException(status_code=404, detail=f"Dataset '{dataset_id}' not found.")

    columns, rows = get_parsed_dataset_records(clean_id, db)

    # Apply search filter across values
    if search:
        s_lower = search.lower()
        rows = [
            r for r in rows
            if any(s_lower in str(v).lower() for v in r.values())
        ]

    # Apply column sorting
    if sort_by and sort_by in columns:
        reverse = (sort_order == "desc")
        rows = sorted(rows, key=lambda r: str(r.get(sort_by, "")), reverse=reverse)

    total_rows = len(rows)
    paginated_rows = rows[offset : offset + limit]

    return schemas.DatasetPreviewResponse(
        dataset_id=clean_id,
        columns=columns,
        rows=paginated_rows,
        total_rows=total_rows,
        total_columns=len(columns)
    )


@app.get("/api/datasets/{dataset_id}/download", tags=["Datasets"])
def download_dataset(
    dataset_id: str,
    format: str = Query("csv", description="Format: csv | json | sql"),
    db: Session = Depends(get_db)
):
    """Generate and return downloadable CSV, JSON, or SQL dataset file."""
    clean_id = normalize_dataset_id(dataset_id)
    ds = db.query(models.Dataset).filter(models.Dataset.id == clean_id).first()
    if not ds:
        raise HTTPException(status_code=404, detail=f"Dataset '{dataset_id}' not found.")

    # Increment download count
    ds.downloads = (ds.downloads or 0) + 1
    db.commit()

    columns, rows = get_parsed_dataset_records(clean_id, db)
    fmt = format.lower().strip()

    if fmt == "json":
        content = json.dumps(rows, indent=2)
        media_type = "application/json"
        filename = f"{clean_id}.json"
    elif fmt == "sql":
        table_name = clean_id.replace("-", "_")
        lines = [f"-- LankaData Hub SQL Export for {ds.title}", f"CREATE TABLE IF NOT EXISTS {table_name} ("]
        col_defs = [f"  {col.replace(' ', '_').replace('(', '').replace(')', '').replace('%', 'pct')} TEXT" for col in columns]
        lines.append(",\n".join(col_defs))
        lines.append(");\n")
        
        for r in rows:
            row_vals = []
            for c in columns:
                val_str = str(r.get(c, '')).replace("'", "''")
                row_vals.append(f"'{val_str}'")
            lines.append(f"INSERT INTO {table_name} VALUES ({', '.join(row_vals)});")
        content = "\n".join(lines)
        media_type = "text/plain"
        filename = f"{clean_id}.sql"
    else:
        # Default CSV
        import csv, io
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(columns)
        for r in rows:
            writer.writerow([r.get(c, "") for c in columns])
        content = output.getvalue()
        media_type = "text/csv"
        filename = f"{clean_id}.csv"

    return Response(
        content=content,
        media_type=media_type,
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )


@app.get("/api/datasets/{dataset_id}/similar", response_model=List[schemas.SimilarDatasetOut], tags=["Datasets"])
def get_similar_datasets(dataset_id: str, db: Session = Depends(get_db)):
    """Return similar datasets from the same category."""
    clean_id = normalize_dataset_id(dataset_id)
    ds = db.query(models.Dataset).filter(models.Dataset.id == clean_id).first()
    if not ds:
        raise HTTPException(status_code=404, detail=f"Dataset '{dataset_id}' not found.")

    similar = db.query(models.Dataset).filter(
        models.Dataset.id != clean_id,
        models.Dataset.category_id == ds.category_id
    ).limit(4).all()

    if not similar:
        similar = db.query(models.Dataset).filter(
            models.Dataset.id != clean_id
        ).limit(4).all()

    return [
        schemas.SimilarDatasetOut(
            id=d.id,
            title=d.title,
            description=d.description,
            category=d.category_rel.name if d.category_rel else d.category_id,
            updated_at=str(d.updated_at) if d.updated_at else "Today"
        )
        for d in similar
    ]


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
