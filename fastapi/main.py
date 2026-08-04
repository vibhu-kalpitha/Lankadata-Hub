"""
LankaData Hub - FastAPI Application
Main entry point providing REST API endpoints for:
  - Categories
  - Datasets (list, filter, detail)
  - Dashboards
  - API Marketplace Specs

Run locally:
    uvicorn main:app --reload --port 8001

Swagger UI: http://localhost:8001/docs
ReDoc:       http://localhost:8001/redoc
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


def ensure_default_datasets_seeded(db: Session):
    """Ensure default dataset records and any postgres dynamic tables exist in datasets metadata table."""
    try:
        for seed_id, seed_data in DEFAULT_DATASETS_SEED.items():
            exists = db.query(models.Dataset).filter(
                (models.Dataset.id == seed_id) | (models.Dataset.id == seed_id.replace("-", "_"))
            ).first()
            if not exists:
                cat_id = seed_data.get("category_id", "economy")
                cat = db.query(models.Category).filter(models.Category.id == cat_id).first()
                if not cat:
                    cat = models.Category(
                        id=cat_id,
                        name=cat_id.capitalize(),
                        icon_name="TrendingUp",
                        description="National GDP, trade, and financial statistics."
                    )
                    db.add(cat)
                    db.commit()

                new_ds = models.Dataset(
                    id=seed_id,
                    title=seed_data["title"],
                    description=seed_data["description"],
                    full_description=seed_data.get("full_description"),
                    category_id=cat_id,
                    formats=seed_data.get("formats", "CSV,JSON,SQL,API"),
                    maintainer=seed_data.get("maintainer", "Official Publisher"),
                    source=seed_data.get("source", "Official Publisher"),
                    frequency=seed_data.get("frequency", "Daily"),
                    coverage=seed_data.get("coverage", "Historical"),
                    live=True,
                    featured=True,
                    file_size=seed_data.get("file_size", "10 MB")
                )
                db.add(new_ds)
                db.commit()

        bind = db.get_bind()
        inspector = inspect(bind)
        all_tables = inspector.get_table_names(schema="public")
        system_tables = {
            "dashboards", "categories", "datasets", "dataset_records",
            "provinces", "api_specs", "spatial_ref_sys"
        }
        for table in all_tables:
            if table.lower() not in system_tables and not table.startswith("pg_") and not table.startswith("mage_"):
                ds_id = table.replace("_", "-")
                ds_exists = db.query(models.Dataset).filter(
                    (models.Dataset.id == ds_id) | (models.Dataset.id == table)
                ).first()
                if not ds_exists:
                    cat = db.query(models.Category).filter(models.Category.id == "economy").first()
                    if not cat:
                        cat = models.Category(id="economy", name="Economy", icon_name="TrendingUp", description="Financial and economic indicators.")
                        db.add(cat)
                        db.commit()

                    title_formatted = table.replace("_", " ").title()
                    new_ds = models.Dataset(
                        id=ds_id,
                        title=title_formatted,
                        description=f"Open dataset table '{table}' from LankaData Hub database.",
                        full_description=f"Auto-indexed dataset table '{table}' stored directly in PostgreSQL.",
                        category_id="economy",
                        formats="CSV,JSON,SQL,API",
                        maintainer="LankaData Hub",
                        source="PostgreSQL Database",
                        frequency="Daily",
                        coverage="Historical",
                        live=True,
                        featured=False,
                        file_size="5 MB"
                    )
                    db.add(new_ds)
                    db.commit()
    except Exception:
        db.rollback()


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
    ensure_default_datasets_seeded(db)
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
        cat_name = ds.category_rel.name if ds.category_rel else (ds.category_id or "Economy").capitalize()
        fmt_list = [f.strip() for f in ds.formats.split(",") if f.strip()] if ds.formats else ["CSV", "JSON", "SQL"]
        datasets_out.append(schemas.DatasetOut(
            id=ds.id,
            title=ds.title,
            description=ds.description,
            category=cat_name,
            formats=fmt_list,
            maintainer=ds.maintainer or "Official Publisher",
            source=ds.source or ds.maintainer or "Official Publisher",
            frequency=ds.frequency or "Daily",
            coverage=ds.coverage or "Historical",
            live=ds.live if ds.live is not None else True,
            featured=ds.featured if ds.featured is not None else False,
            views=ds.views or 0,
            downloads=ds.downloads or 0,
            total_records=ds.total_records or 0,
            file_size=ds.file_size or "10 MB",
            updated_at=str(ds.updated_at) if ds.updated_at else "Recently updated"
        ))

    return schemas.DatasetListResponse(datasets=datasets_out, total=total, pages=total_pages)


@app.get("/api/datasets/latest", response_model=List[schemas.DatasetOut], tags=["Datasets"])
def latest_datasets(
    limit: int = Query(4, ge=1, le=20),
    db: Session = Depends(get_db)
):
    """Return the most recently published datasets."""
    ensure_default_datasets_seeded(db)
    items = db.query(models.Dataset).order_by(models.Dataset.created_at.desc()).limit(limit).all()
    out = []
    for ds in items:
        cat_name = ds.category_rel.name if ds.category_rel else (ds.category_id or "Economy").capitalize()
        fmt_list = [f.strip() for f in ds.formats.split(",") if f.strip()] if ds.formats else ["CSV", "JSON", "SQL"]
        out.append(schemas.DatasetOut(
            id=ds.id,
            title=ds.title,
            description=ds.description,
            category=cat_name,
            formats=fmt_list,
            maintainer=ds.maintainer or "Official Publisher",
            source=ds.source or ds.maintainer or "Official Publisher",
            frequency=ds.frequency or "Daily",
            coverage=ds.coverage or "Historical",
            live=ds.live if ds.live is not None else True,
            featured=ds.featured if ds.featured is not None else False,
            views=ds.views or 0,
            downloads=ds.downloads or 0,
            total_records=ds.total_records or 0,
            file_size=ds.file_size or "10 MB",
            updated_at=str(ds.updated_at) if ds.updated_at else "Recently updated"
        ))
    return out



# Helper to parse dataset records dynamically from Postgres tables or DatasetRecord
import json
from fastapi.responses import Response
from sqlalchemy import inspect, text

DEFAULT_DATASETS_SEED = {
    "usd-exchange-rates": {
        "title": "USD Exchange Rates",
        "description": "Historical daily USD buying and selling exchange rates published by the Central Bank of Sri Lanka.",
        "full_description": "Comprehensive daily USD exchange rate dataset maintained by the Central Bank of Sri Lanka (CBSL). Contains buying and selling rates against LKR with historical coverage.",
        "category_id": "economy",
        "formats": "CSV,JSON,SQL,API",
        "maintainer": "Central Bank of Sri Lanka",
        "source": "Central Bank of Sri Lanka",
        "frequency": "Daily",
        "coverage": "2005 - Present",
        "live": True,
        "featured": True,
        "file_size": "12.4 MB"
    },
    "hnb-usd-exchange-rates": {
        "title": "HNB USD Exchange Rates",
        "description": "Daily US Dollar buying and selling exchange rates published by Hatton National Bank (HNB), Sri Lanka.",
        "full_description": "Commercial bank exchange rates for USD published daily by Hatton National Bank (HNB), including buying and selling telegraphic transfers (TT) and note rates.",
        "category_id": "economy",
        "formats": "CSV,JSON,SQL,API",
        "maintainer": "Hatton National Bank",
        "source": "Hatton National Bank",
        "frequency": "Daily",
        "coverage": "2020 - Present",
        "live": True,
        "featured": True,
        "file_size": "8.1 MB"
    }
}

def resolve_dataset_object(dataset_id: str, db: Session) -> Optional[models.Dataset]:
    raw_id = (dataset_id or "").strip().lower()
    if not raw_id:
        return None

    if raw_id in ["hnb-usd-exchange-rates", "hnb-usd-rates", "hnb-usd-exchange-rate", "hnb_usd_exchange_rates"]:
        ids_to_try = ["hnb-usd-exchange-rates", "hnb-usd-rates", "hnb_usd_exchange_rates"]
    elif raw_id in ["usd-exchange-rates", "usd-exchange-rate", "usd_exchange_rates"]:
        ids_to_try = ["usd-exchange-rates", "usd_exchange_rates"]
    else:
        ids_to_try = [raw_id, raw_id.replace("_", "-"), raw_id.replace("-", "_")]

    for cand_id in ids_to_try:
        ds = db.query(models.Dataset).filter(models.Dataset.id == cand_id).first()
        if ds:
            return ds

    # Auto-seed default dataset metadata if missing from DB
    for seed_id, seed_data in DEFAULT_DATASETS_SEED.items():
        if seed_id in ids_to_try or raw_id == seed_id:
            try:
                cat = db.query(models.Category).filter(models.Category.id == seed_data["category_id"]).first()
                if not cat:
                    cat = models.Category(id="economy", name="Economy", icon_name="TrendingUp", description="National GDP and financial statistics.")
                    db.add(cat)
                    db.commit()

                new_ds = models.Dataset(id=seed_id, **seed_data)
                db.add(new_ds)
                db.commit()
                db.refresh(new_ds)
                return new_ds
            except Exception:
                db.rollback()

    return db.query(models.Dataset).filter(models.Dataset.id.ilike(f"%{raw_id}%")).first()


def get_dynamic_table_records(dataset_id: str, db: Session, search: Optional[str] = None, sort_by: Optional[str] = None, sort_order: Optional[str] = "asc", limit: Optional[int] = None, offset: Optional[int] = None):
    clean_id = (dataset_id or "").strip().lower()
    
    try:
        bind = db.get_bind()
        inspector = inspect(bind)
        all_tables = inspector.get_table_names(schema="public")
    except Exception:
        all_tables = []

    candidate_tables = [
        clean_id.replace("-", "_"),
        clean_id,
    ]
    if clean_id in ["hnb-usd-exchange-rates", "hnb-usd-rates", "hnb-usd-exchange-rate"]:
        candidate_tables.extend(["hnb_usd_exchange_rates", "hnb_usd_rates"])
    if clean_id in ["usd-exchange-rates", "usd-exchange-rate"]:
        candidate_tables.extend(["usd_exchange_rates", "usd_exchange_rate"])

    target_table = None
    for cand in candidate_tables:
        if cand in all_tables:
            target_table = cand
            break

    if target_table:
        try:
            col_info = inspector.get_columns(target_table, schema="public")
            all_cols = [c["name"] for c in col_info]
            display_columns = [c for c in all_cols if c.lower() != 'id'] if len(all_cols) > 1 else all_cols

            where_clause = ""
            params = {}
            if search and search.strip():
                s_val = f"%{search.strip()}%"
                search_conds = []
                for i, c in enumerate(display_columns):
                    param_key = f"search_{i}"
                    search_conds.append(f'CAST("{c}" AS TEXT) ILIKE :{param_key}')
                    params[param_key] = s_val
                if search_conds:
                    where_clause = " WHERE " + " OR ".join(search_conds)

            order_clause = ""
            if sort_by and sort_by in display_columns:
                direction = "DESC" if sort_order and sort_order.lower() == "desc" else "ASC"
                order_clause = f' ORDER BY "{sort_by}" {direction}'

            count_sql = text(f'SELECT COUNT(*) FROM "{target_table}"{where_clause}')
            total_count = db.execute(count_sql, params).scalar() or 0

            limit_clause = ""
            if limit is not None:
                limit_clause = f" LIMIT {int(limit)}"
                if offset is not None:
                    limit_clause += f" OFFSET {int(offset)}"

            col_select = ", ".join([f'"{c}"' for c in display_columns])
            data_sql = text(f'SELECT {col_select} FROM "{target_table}"{where_clause}{order_clause}{limit_clause}')
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

            return display_columns, rows, total_count
        except Exception:
            pass

    # Fallback to DatasetRecord table
    records = db.query(models.DatasetRecord).filter(
        models.DatasetRecord.dataset_id.in_([clean_id, clean_id.replace("-", "_"), clean_id.replace("_", "-")])
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

    if search and search.strip():
        s_lower = search.strip().lower()
        rows = [r for r in rows if any(s_lower in str(v).lower() for v in r.values())]

    if sort_by and sort_by in columns_set:
        reverse = (sort_order == "desc")
        rows = sorted(rows, key=lambda r: str(r.get(sort_by, "")), reverse=reverse)

    total_count = len(rows)
    if limit is not None:
        off = offset or 0
        rows = rows[off : off + limit]

    return columns_set, rows, total_count


@app.get("/api/datasets/{dataset_id}", response_model=schemas.DatasetDetailOut, tags=["Datasets"])
def get_dataset(dataset_id: str, db: Session = Depends(get_db)):
    """Return full details of a single dataset including metadata and initial preview rows."""
    ds = resolve_dataset_object(dataset_id, db)
    if not ds:
        raise HTTPException(status_code=404, detail=f"Dataset '{dataset_id}' not found.")

    ds.views = (ds.views or 0) + 1
    db.commit()

    columns, rows, total_count = get_dynamic_table_records(ds.id, db, limit=20)
    total_recs = total_count if total_count > 0 else (ds.total_records or 0)

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
        preview_rows=rows
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
    ds = resolve_dataset_object(dataset_id, db)
    if not ds:
        raise HTTPException(status_code=404, detail=f"Dataset '{dataset_id}' not found.")

    columns, rows, total_count = get_dynamic_table_records(
        ds.id, db, search=search, sort_by=sort_by, sort_order=sort_order, limit=limit, offset=offset
    )

    return schemas.DatasetPreviewResponse(
        dataset_id=ds.id,
        columns=columns,
        rows=rows,
        total_rows=total_count,
        total_columns=len(columns)
    )


@app.get("/api/datasets/{dataset_id}/download", tags=["Datasets"])
def download_dataset(
    dataset_id: str,
    format: str = Query("csv", description="Format: csv | json | sql"),
    db: Session = Depends(get_db)
):
    """Generate and return downloadable CSV, JSON, or SQL dataset file."""
    ds = resolve_dataset_object(dataset_id, db)
    if not ds:
        raise HTTPException(status_code=404, detail=f"Dataset '{dataset_id}' not found.")

    ds.downloads = (ds.downloads or 0) + 1
    db.commit()

    columns, rows, _ = get_dynamic_table_records(ds.id, db)
    fmt = format.lower().strip()
    clean_filename = ds.id.replace("-", "_")

    if fmt == "json":
        content = json.dumps(rows, indent=2)
        media_type = "application/json"
        filename = f"{clean_filename}.json"
    elif fmt == "sql":
        table_name = clean_filename
        lines = [f"-- LankaData Hub SQL Export for {ds.title}", f"CREATE TABLE IF NOT EXISTS {table_name} ("]
        col_defs = [f'  "{col}" TEXT' for col in columns]
        lines.append(",\n".join(col_defs))
        lines.append(");\n")
        
        for r in rows:
            row_vals = []
            for c in columns:
                val_str = str(r.get(c, '') if r.get(c) is not None else '').replace("'", "''")
                row_vals.append(f"'{val_str}'")
            lines.append(f"INSERT INTO {table_name} VALUES ({', '.join(row_vals)});")
        content = "\n".join(lines)
        media_type = "text/plain"
        filename = f"{clean_filename}.sql"
    else:
        import csv, io
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


@app.get("/api/datasets/{dataset_id}/records", response_model=schemas.DatasetPreviewResponse, tags=["Datasets"])
def get_dataset_records(
    dataset_id: str,
    search: Optional[str] = Query(None),
    sort_by: Optional[str] = Query(None),
    sort_order: Optional[str] = Query("asc"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=1000),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    """Alias for /preview — returns paginated dataset records with optional search and sort."""
    ds = resolve_dataset_object(dataset_id, db)
    if not ds:
        raise HTTPException(status_code=404, detail=f"Dataset '{dataset_id}' not found.")

    computed_offset = offset if offset > 0 else (page - 1) * limit
    columns, rows, total_count = get_dynamic_table_records(
        ds.id, db, search=search, sort_by=sort_by, sort_order=sort_order, limit=limit, offset=computed_offset
    )

    return schemas.DatasetPreviewResponse(
        dataset_id=ds.id,
        columns=columns,
        rows=rows,
        total_rows=total_count,
        total_columns=len(columns)
    )


@app.get("/api/datasets/{dataset_id}/download/{file_format}", tags=["Datasets"])
def download_dataset_by_path(
    dataset_id: str,
    file_format: str,
    db: Session = Depends(get_db)
):
    """Path-based alias for download — /api/datasets/:id/download/csv|json|sql."""
    return download_dataset(dataset_id=dataset_id, format=file_format, db=db)


@app.get("/api/datasets/{dataset_id}/similar", response_model=List[schemas.SimilarDatasetOut], tags=["Datasets"])
def get_similar_datasets(dataset_id: str, db: Session = Depends(get_db)):
    """Return similar datasets from the same category."""
    ds = resolve_dataset_object(dataset_id, db)
    if not ds:
        raise HTTPException(status_code=404, detail=f"Dataset '{dataset_id}' not found.")

    similar = db.query(models.Dataset).filter(
        models.Dataset.id != ds.id,
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


# ─── Province Endpoints ───────────────────────────────────────────────────────

@app.get("/api/provinces", response_model=List[schemas.ProvinceOut], tags=["Provinces"])
def list_provinces(db: Session = Depends(get_db)):
    """Return all Sri Lanka provinces ordered alphabetically."""
    rows = db.query(models.Province).order_by(models.Province.province.asc()).all()
    result = []
    for row in rows:
        result.append(schemas.ProvinceOut(
            id=row.id,
            province=row.province,
            provincial_capital=row.provincial_capital,
            total_area_km2=row.total_area_km2,
            estimated_population=row.estimated_population,
            districts_included=[d.strip() for d in row.districts_included.split(",")],
            data_source=row.data_source,
            last_updated=row.last_updated,
        ))
    return result
