"""
LankaData Hub - Pydantic Schemas
Request/Response validation schemas for the FastAPI layer.
"""

from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


# ─── Category Schemas ─────────────────────────────────────────────────────────

class CategoryBase(BaseModel):
    id: str
    name: str
    icon_name: str
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
    formats: List[str]
    maintainer: Optional[str] = None
    frequency: Optional[str] = None
    coverage: Optional[str] = None
    live: bool = False
    featured: bool = False
    views: int = 0
    downloads: int = 0
    updated_at: Optional[str] = None


class DatasetOut(DatasetBase):
    class Config:
        from_attributes = True


class DatasetPreviewRow(BaseModel):
    year: Optional[str]
    region: Optional[str]
    indicator_value: Optional[float]
    growth_pct: Optional[float]


class DatasetDetailOut(DatasetOut):
    full_description: Optional[str] = None
    preview_rows: List[DatasetPreviewRow] = []


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
    updated_at: Optional[str] = None

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
    estimated_population: str
    districts_included: List[str]   # returned as list, stored as comma-separated
    data_source: Optional[str] = None
    last_updated: Optional[str] = None

    class Config:
        from_attributes = True
