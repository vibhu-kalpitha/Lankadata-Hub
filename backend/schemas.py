"""
LankaData Hub - Pydantic Schemas
Request/Response validation schemas for the FastAPI layer.
"""

from pydantic import BaseModel
from typing import List, Optional, Union
from datetime import date, datetime


# ─── Category Schemas ─────────────────────────────────────────────────────────

class CategoryBase(BaseModel):
    id: str
    name: str
    icon_name: Optional[str] = None
    iconName: Optional[str] = None
    description: Optional[str] = None


class CategoryOut(CategoryBase):
    count: int = 0

    class Config:
        from_attributes = True


# ─── Dataset Schemas ──────────────────────────────────────────────────────────

class DatasetBase(BaseModel):
    id: str
    title: str
    description: str
    category: str
    table_name: Optional[str] = None
    primary_date_column: Optional[str] = None
    formats: List[str]
    maintainer: Optional[str] = None
    source: Optional[str] = None
    frequency: Optional[str] = None
    coverage: Optional[str] = None
    live: bool = False
    featured: bool = False
    views: int = 0
    downloads: int = 0
    total_records: int = 0
    file_size: Optional[str] = None
    created_at: Optional[Union[str, date, datetime]] = None
    updated_at: Optional[Union[str, date, datetime]] = None


class DatasetOut(DatasetBase):
    class Config:
        from_attributes = True


class DatasetPreviewRow(BaseModel):
    year: Optional[str] = None
    region: Optional[str] = None
    indicator_value: Optional[float] = None
    growth_pct: Optional[float] = None


class DatasetDetailOut(DatasetOut):
    full_description: Optional[str] = None
    columns: List[str] = []
    preview_rows: List[dict] = []


class DatasetPreviewResponse(BaseModel):
    dataset_id: str
    columns: List[str]
    rows: List[dict]
    total_rows: int
    total_columns: int


class SimilarDatasetOut(BaseModel):
    id: str
    title: str
    description: str
    category: str
    updated_at: Optional[Union[str, date, datetime]] = None


class DatasetListResponse(BaseModel):
    datasets: List[DatasetOut]
    total: int
    pages: int


# ─── Dashboard Schemas ────────────────────────────────────────────────────────

class DashboardOut(BaseModel):
    id: str
    title: str
    description: str
    category: str
    author: Optional[str] = None
    live: bool = False
    featured: bool = False
    views: int = 0
    api_endpoint: Optional[str] = None
    embed_url: Optional[str] = None
    updated_at: Optional[Union[str, date, datetime]] = None

    class Config:
        from_attributes = True


# ─── API Spec Schemas ─────────────────────────────────────────────────────────

class APISpecOut(BaseModel):
    id: str
    title: str
    description: str
    category: str
    method: str
    endpoint: str
    pricing: str
    status: str
    dataset_id: Optional[str] = None

    class Config:
        from_attributes = True


# ─── Province Schemas ─────────────────────────────────────────────────────────

class ProvinceOut(BaseModel):
    id: int
    province: str
    provincial_capital: str
    total_area_km2: float
    estimated_population: Optional[Union[int, str]] = None
    districts_included: List[str]   # returned as list, stored as comma-separated
    data_source: Optional[str] = None
    last_updated: Optional[Union[date, datetime, str]] = None

    class Config:
        from_attributes = True


# ─── News Ingestion Schemas ───────────────────────────────────────────────────

class NewsIngestRequest(BaseModel):
    title: str
    url: Optional[str] = None
    source: str
    content: str
    is_sri_lanka_related: bool
    category: str
    province: str
    summary: str
    keywords: List[str]
    useful_for_sri_lankan_news: bool


class NewsIngestResponse(BaseModel):
    status: str
    message: str
