"""
LankaData Hub - SQLAlchemy ORM Models
Defines the database table schema for all entities.
"""

from sqlalchemy import (
    Column, Integer, String, Float, Boolean,
    Text, DateTime, ForeignKey, ARRAY
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class Category(Base):
    """Dataset category (Economy, Health, Weather, etc.)"""
    __tablename__ = "categories"

    id = Column(String(50), primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    icon_name = Column(String(50), nullable=False)
    description = Column(Text, nullable=True)

    # Relationships
    datasets = relationship("Dataset", back_populates="category_rel")


class Dataset(Base):
    """A published open dataset record."""
    __tablename__ = "datasets"

    id = Column(String(100), primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    full_description = Column(Text, nullable=True)
    category_id = Column(String(50), ForeignKey("categories.id"), nullable=False)
    formats = Column(String(200), nullable=False)   # Stored as comma-separated: "CSV,JSON"
    maintainer = Column(String(200), nullable=True)
    frequency = Column(String(100), nullable=True)
    coverage = Column(String(100), nullable=True)
    live = Column(Boolean, default=False)
    featured = Column(Boolean, default=False)
    views = Column(Integer, default=0)
    downloads = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    category_rel = relationship("Category", back_populates="datasets")
    records = relationship("DatasetRecord", back_populates="dataset")


class DatasetRecord(Base):
    """An individual row of data within a dataset."""
    __tablename__ = "dataset_records"

    id = Column(Integer, primary_key=True, autoincrement=True)
    dataset_id = Column(String(100), ForeignKey("datasets.id"), nullable=False)
    year = Column(String(20), nullable=True)
    region = Column(String(100), nullable=True)
    indicator_value = Column(Float, nullable=True)
    growth_pct = Column(Float, nullable=True)
    extra_data = Column(Text, nullable=True)  # JSON string for flexible fields

    # Relationship
    dataset = relationship("Dataset", back_populates="records")


class Dashboard(Base):
    """An interactive intelligence dashboard."""
    __tablename__ = "dashboards"

    id = Column(String(100), primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(100), nullable=False)
    author = Column(String(200), nullable=True)
    live = Column(Boolean, default=False)
    featured = Column(Boolean, default=False)
    views = Column(Integer, default=0)
    api_endpoint = Column(String(200), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class APISpec(Base):
    """A documented REST API endpoint specification."""
    __tablename__ = "api_specs"

    id = Column(String(100), primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(100), nullable=False)
    method = Column(String(10), nullable=False, default="GET")
    endpoint = Column(String(300), nullable=False)
    pricing = Column(String(50), nullable=False, default="Free")
    status = Column(String(20), nullable=False, default="active")
    dataset_id = Column(String(100), ForeignKey("datasets.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
