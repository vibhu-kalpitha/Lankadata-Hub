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
    "sqlite:///./lankadata_hub.db"
)

engine_kwargs = {"echo": False}
if DATABASE_URL.startswith("sqlite"):
    engine_kwargs["connect_args"] = {"check_same_thread": False}
else:
    engine_kwargs.update({
        "pool_pre_ping": True,
        "pool_size": 5,
        "max_overflow": 10
    })

engine = create_engine(DATABASE_URL, **engine_kwargs)

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
