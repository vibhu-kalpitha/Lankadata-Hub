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
    source: Optional[str] = None
    frequency: Optional[str] = None
    coverage: Optional[str] = None
    live: bool = False
    featured: bool = False
    views: int = 0
    downloads: int = 0
    total_records: int = 0
    file_size: Optional[str] = None
    updated_at: Optional[str] = None


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
    updated_at: Optional[str] = None


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
