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
# Allow the React frontend dev server to access the API
CORS_ORIGINS = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:5173,http://localhost:3000"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
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


@app.get("/api/datasets/{dataset_id}", response_model=schemas.DatasetDetailOut, tags=["Datasets"])
def get_dataset(dataset_id: str, db: Session = Depends(get_db)):
    """Return full details of a single dataset including preview rows."""
    ds = db.query(models.Dataset).filter(models.Dataset.id == dataset_id).first()
    if not ds:
        raise HTTPException(status_code=404, detail=f"Dataset '{dataset_id}' not found.")

    records = db.query(models.DatasetRecord).filter(
        models.DatasetRecord.dataset_id == dataset_id
    ).limit(10).all()

    preview_rows = [
        schemas.DatasetPreviewRow(
            year=r.year,
            region=r.region,
            indicator_value=r.indicator_value,
            growth_pct=r.growth_pct
        )
        for r in records
    ]

    return schemas.DatasetDetailOut(
        id=ds.id, title=ds.title, description=ds.description,
        full_description=ds.full_description,
        category=ds.category_rel.name if ds.category_rel else ds.category_id,
        formats=ds.formats.split(","), maintainer=ds.maintainer,
        frequency=ds.frequency, coverage=ds.coverage,
        live=ds.live, featured=ds.featured,
        views=ds.views, downloads=ds.downloads,
        preview_rows=preview_rows,
        updated_at=str(ds.updated_at) if ds.updated_at else "Recently updated"
    )


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
