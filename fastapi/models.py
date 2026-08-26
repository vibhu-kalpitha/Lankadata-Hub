"""
LankaData Hub - SQLAlchemy ORM Models
Defines the database table schema for all entities.
"""

from sqlalchemy import (
    Column, Integer, String, Float, Boolean,
    Text, DateTime, Date, ForeignKey, ARRAY
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
    table_name = Column(String(100), nullable=True)   # Actual PostgreSQL data table name (e.g. "usd_exchange_rates")
    primary_date_column = Column(String(100), nullable=True) # Column name for date/time indexing
    formats = Column(String(200), nullable=False, default="CSV,JSON,SQL,API")   # Stored as comma-separated: "CSV,JSON"
    maintainer = Column(String(200), nullable=True)
    frequency = Column(String(100), nullable=True)
    coverage = Column(String(100), nullable=True)
    live = Column(Boolean, default=True)
    featured = Column(Boolean, default=False)
    source = Column(String(200), nullable=True)
    total_records = Column(Integer, default=0)
    file_size = Column(String(50), nullable=True)
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
    data_source = Column(String(200), nullable=True)
    last_updated = Column(DateTime(timezone=True), server_default=func.now())


class SriLankaNews(Base):
    """News article entity for Sri Lanka news feed."""
    __tablename__ = "sri_lanka_news"

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(Text, unique=True, nullable=False, index=True)
    url = Column(Text, nullable=True)
    source = Column(Text, nullable=True)
    content = Column(Text, nullable=True)
    is_sri_lanka_related = Column(Boolean, default=True)
    category = Column(String(100), nullable=True)
    province = Column(String(100), nullable=True)
    summary = Column(Text, nullable=True)
    keywords = Column(Text, nullable=True)
    useful_for_sri_lankan_news = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


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


class Province(Base):
    """Sri Lanka province with demographic and geographic data."""
    __tablename__ = "provinces"

    id = Column(Integer, primary_key=True, autoincrement=True)
    province = Column(String(100), nullable=False, unique=True, index=True)
    provincial_capital = Column(String(100), nullable=False)
    total_area_km2 = Column(Float, nullable=False)
    estimated_population = Column(Integer, nullable=True)
    districts_included = Column(Text, nullable=False)  # comma-separated list
    data_source = Column(String(200), nullable=True)
    last_updated = Column(Date, nullable=True)


class MetroMostConnectCity(Base):
    """Most connected cities table for Metro Bus Analysis."""
    __tablename__ = "metro_most_connect_cities"

    id = Column(Integer, primary_key=True, autoincrement=True)
    city_hub = Column(String(150), nullable=True)
    routes_serving_it = Column(String(50), nullable=True)
    primary_destinations = Column(Text, nullable=True)
    major_connections = Column(Text, nullable=True)
    total_stops = Column(String(50), nullable=True)


class MetroBus(Base):
    """Metro Bus routes table for Metro Bus Analysis."""
    __tablename__ = "metro_bus"

    id = Column(Integer, primary_key=True, autoincrement=True)
    route_code = Column(String(50), nullable=True)
    route_name = Column(String(200), nullable=True)
    origin_terminal = Column(String(100), nullable=True)
    destination_terminal = Column(String(100), nullable=True)
    category = Column(String(100), nullable=True)
    distance_km = Column(String(50), nullable=True)
    approx_duration = Column(String(50), nullable=True)
    total_stops = Column(Integer, nullable=True)
    stops_sequence = Column(Text, nullable=True)
    departure_schedules = Column(Text, nullable=True)
    service_notes = Column(Text, nullable=True)
    contact_number = Column(String(50), nullable=True)
    data_source = Column(String(100), nullable=True)
    pipeline_date = Column(Date, nullable=True)
    last_updated_date = Column(DateTime(timezone=True), nullable=True)


class MetroTotal(Base):
    """Metro Bus totals summary table for Metro Bus Analysis."""
    __tablename__ = "metro_total"

    id = Column(Integer, primary_key=True, autoincrement=True)
    network_metric = Column(String(150), nullable=True)
    total_count = Column(String(50), nullable=True)
    key_locations_and_details = Column(Text, nullable=True)
