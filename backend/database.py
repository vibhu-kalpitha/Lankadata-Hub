"""
LankaData Hub - Database Connection
Manages SQLAlchemy engine creation and session lifecycle.
Replace DATABASE_URL in .env with your actual PostgreSQL credentials.
"""

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Load from environment variable (set in .env file)
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:postgres@localhost:5432/lankadata_hub"
)

# Create the SQLAlchemy engine
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,       # Verify connection before use
    pool_size=5,              # Max connections in pool
    max_overflow=10,          # Allow extra connections under load
    echo=False                # Set True for SQL query logging during dev
)

# Session factory for dependency injection
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for all ORM models
Base = declarative_base()


def get_db():
    """
    FastAPI dependency that provides a DB session per request.
    Usage in route: db: Session = Depends(get_db)
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
