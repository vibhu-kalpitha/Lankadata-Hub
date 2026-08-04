"""
LankaData Hub - Database Seed Script
Creates all tables in PostgreSQL and populates them with Categories and Provinces only.
Datasets, dataset records, dashboards, and API specs must be inserted via the admin panel
or direct PostgreSQL operations - never via seed.

Usage:
    python seed.py

Prerequisites:
    - PostgreSQL must be running.
    - Update DATABASE_URL in .env if needed.
"""

from database import engine, SessionLocal, Base
import models


def create_tables():
    """Create all tables defined in models.py."""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✓ Tables created successfully.")


def seed_data():
    """Seed the database with categories and provinces only."""
    db = SessionLocal()
    try:
        # ─── Seed Categories ──────────────────────────────────────────────────
        categories_data = [
            models.Category(id="economy",       name="Economy",        icon_name="TrendingUp",   description="National GDP, inflation, trade and financial statistics."),
            models.Category(id="health",        name="Health",         icon_name="Activity",     description="Disease tracking, hospital capacities, vaccination rates."),
            models.Category(id="weather",       name="Weather",        icon_name="CloudRain",    description="Monsoon metrics, temperature and humidity tracking."),
            models.Category(id="agriculture",   name="Agriculture",    icon_name="Leaf",         description="Harvest yields, pesticide and fertilizer consumption indices."),
            models.Category(id="education",     name="Education",      icon_name="GraduationCap",description="Literacy rates, university enrollment statistics."),
            models.Category(id="tourism",       name="Tourism",        icon_name="Compass",      description="Monthly arrivals, tourist expenditure indicators."),
            models.Category(id="transportation",name="Transportation", icon_name="Truck",        description="Expressway traffic, vehicle registration, transit usage."),
        ]

        for cat in categories_data:
            exists = db.query(models.Category).filter_by(id=cat.id).first()
            if not exists:
                db.add(cat)

        db.commit()
        print("✓ Categories seeded.")

        # ─── Seed Provinces ───────────────────────────────────────────────────
        provinces_data = [
            models.Province(
                province="Central",
                provincial_capital="Kandy",
                total_area_km2=5674.0,
                estimated_population="2.8M",
                districts_included="Kandy, Matale, Nuwara Eliya",
                data_source="Department of Census and Statistics",
                last_updated="2023"
            ),
            models.Province(
                province="Eastern",
                provincial_capital="Trincomalee",
                total_area_km2=9996.0,
                estimated_population="1.7M",
                districts_included="Trincomalee, Batticaloa, Ampara",
                data_source="Department of Census and Statistics",
                last_updated="2023"
            ),
            models.Province(
                province="North Central",
                provincial_capital="Anuradhapura",
                total_area_km2=10472.0,
                estimated_population="1.4M",
                districts_included="Anuradhapura, Polonnaruwa",
                data_source="Department of Census and Statistics",
                last_updated="2023"
            ),
            models.Province(
                province="North Western",
                provincial_capital="Kurunegala",
                total_area_km2=7888.0,
                estimated_population="2.5M",
                districts_included="Kurunegala, Puttalam",
                data_source="Department of Census and Statistics",
                last_updated="2023"
            ),
            models.Province(
                province="Northern",
                provincial_capital="Jaffna",
                total_area_km2=8884.0,
                estimated_population="1.1M",
                districts_included="Jaffna, Kilinochchi, Mannar, Vavuniya, Mullaitivu",
                data_source="Department of Census and Statistics",
                last_updated="2023"
            ),
            models.Province(
                province="Sabaragamuwa",
                provincial_capital="Ratnapura",
                total_area_km2=4968.0,
                estimated_population="2.0M",
                districts_included="Ratnapura, Kegalle",
                data_source="Department of Census and Statistics",
                last_updated="2023"
            ),
            models.Province(
                province="Southern",
                provincial_capital="Galle",
                total_area_km2=5544.0,
                estimated_population="2.6M",
                districts_included="Galle, Matara, Hambantota",
                data_source="Department of Census and Statistics",
                last_updated="2023"
            ),
            models.Province(
                province="Uva",
                provincial_capital="Badulla",
                total_area_km2=8500.0,
                estimated_population="1.3M",
                districts_included="Badulla, Moneragala",
                data_source="Department of Census and Statistics",
                last_updated="2023"
            ),
            models.Province(
                province="Western",
                provincial_capital="Colombo",
                total_area_km2=3684.0,
                estimated_population="6.2M",
                districts_included="Colombo, Gampaha, Kalutara",
                data_source="Department of Census and Statistics",
                last_updated="2023"
            ),
        ]

        existing_count = db.query(models.Province).count()
        if existing_count == 0:
            for prov in provinces_data:
                db.add(prov)
            db.commit()
            print("✓ Provinces seeded.")
        else:
            print("✓ Provinces already seeded, skipping.")

        print("\n🎉 LankaData Hub base data seeded successfully!")
        print("   Datasets, dashboards, and API specs must be added via the admin panel or PostgreSQL.")

    except Exception as e:
        db.rollback()
        print(f"❌ Error seeding data: {e}")
        raise e
    finally:
        db.close()


if __name__ == "__main__":
    create_tables()
    seed_data()
