"""
LankaData Hub - Database Seed Script
Creates all tables in PostgreSQL and populates them with initial sample data.

Usage:
    python seed.py

Prerequisites:
    - PostgreSQL must be running locally.
    - A database named 'lankadata_hub' must exist.
    - Update DATABASE_URL in .env or environment if needed.
"""

from database import engine, SessionLocal, Base
import models


def create_tables():
    """Create all tables defined in models.py."""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✓ Tables created successfully.")


def seed_data():
    """Seed the database with initial sample data."""
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

        # ─── Seed Datasets ────────────────────────────────────────────────────
        datasets_data = [
            models.Dataset(
                id="annual-gdp-growth",
                title="Annual GDP Growth Rates",
                description="Historical and projected annual GDP growth percentages for Sri Lanka.",
                full_description="This dataset offers a comprehensive perspective on national fiscal priority by tracking real GDP growth percentages from 1960 to 2024.",
                category_id="economy",
                formats="CSV,JSON,SQL",
                maintainer="Department of Census",
                frequency="Real-time / Monthly",
                coverage="1960 - Present",
                live=True,
                featured=True,
                views=5488,
                downloads=1240
            ),
            models.Dataset(
                id="monthly-fuel-prices",
                title="Monthly Fuel Price Trends",
                description="Comprehensive monthly tracking of Petrol, Diesel, and Kerosene prices.",
                full_description="Detailed statistics tracking fuel retail pricing since 2018 across CPC and LIOC distributors.",
                category_id="economy",
                formats="API,Excel",
                maintainer="Ministry of Power & Energy",
                frequency="Monthly",
                coverage="2018 - Present",
                live=True,
                featured=True,
                views=3120,
                downloads=890
            ),
            models.Dataset(
                id="district-population-census",
                title="District-wise Population Census",
                description="Demographic breakdown by district including age groups and rural-urban migration.",
                full_description="Complete demographic analysis of all 25 Sri Lankan districts based on census data.",
                category_id="economy",
                formats="CSV,JSON",
                maintainer="Department of Census and Statistics",
                frequency="Decennial",
                coverage="1981 - 2023",
                live=False,
                featured=True,
                views=4510,
                downloads=1530
            ),
            models.Dataset(
                id="public-health-indicators",
                title="Public Health Indicators",
                description="Weekly statistics on infectious diseases, vaccination rates, and hospital capacity.",
                full_description="Real-time epidemiological parameters covering dengue, malaria, and vaccination from the Epidemiology Unit.",
                category_id="health",
                formats="JSON,API",
                maintainer="Epidemiology Unit, Ministry of Health",
                frequency="Weekly",
                coverage="2015 - Present",
                live=True,
                featured=False,
                views=6120,
                downloads=915
            ),
        ]

        for ds in datasets_data:
            exists = db.query(models.Dataset).filter_by(id=ds.id).first()
            if not exists:
                db.add(ds)

        db.commit()
        print("✓ Datasets seeded.")

        # ─── Seed Dataset Records ─────────────────────────────────────────────
        records_data = [
            models.DatasetRecord(dataset_id="annual-gdp-growth", year="2024 (Projected)", region="Western Province",  indicator_value=12450.50, growth_pct=4.2),
            models.DatasetRecord(dataset_id="annual-gdp-growth", year="2023",             region="Central Province",  indicator_value=8210.20,  growth_pct=2.8),
            models.DatasetRecord(dataset_id="annual-gdp-growth", year="2023",             region="Southern Province", indicator_value=7430.80,  growth_pct=3.1),
            models.DatasetRecord(dataset_id="annual-gdp-growth", year="2022",             region="Western Province",  indicator_value=11940.10, growth_pct=-1.5),
            models.DatasetRecord(dataset_id="annual-gdp-growth", year="2021",             region="Western Province",  indicator_value=12120.40, growth_pct=3.5),
        ]

        existing_count = db.query(models.DatasetRecord).filter_by(dataset_id="annual-gdp-growth").count()
        if existing_count == 0:
            for record in records_data:
                db.add(record)

        db.commit()
        print("✓ Dataset records seeded.")

        # ─── Seed Dashboards ──────────────────────────────────────────────────
        dashboards_data = [
            models.Dashboard(
                id="national-gdp-growth",
                title="National GDP & Economic Growth",
                description="Comprehensive tracking of GDP growth rates and economic forecasts.",
                category="Economy",
                author="National Intelligence Unit",
                live=True,
                featured=True,
                views=12400,
                api_endpoint="/api/v1/economy/gdp-growth"
            ),
            models.Dashboard(
                id="dengue-outbreak-dashboard",
                title="Dengue Outbreak Dashboard",
                description="Hospital bed availability, weekly case stats, and critical hotspot tracking.",
                category="Health",
                author="Epidemiology Unit",
                live=True,
                featured=True,
                views=18900,
                api_endpoint="/api/v1/health/dengue-outbreak"
            ),
        ]

        for db_obj in dashboards_data:
            exists = db.query(models.Dashboard).filter_by(id=db_obj.id).first()
            if not exists:
                db.add(db_obj)

        db.commit()
        print("✓ Dashboards seeded.")

        # ─── Seed API Specs ───────────────────────────────────────────────────
        apis_data = [
            models.APISpec(
                id="gdp-growth-api",
                title="GDP Growth Rate REST API",
                description="Fetch historical and current GDP growth rates and economic sectors.",
                category="Economy",
                method="GET",
                endpoint="/api/v1/economy/gdp-growth",
                pricing="Free",
                status="active",
                dataset_id="annual-gdp-growth"
            ),
            models.APISpec(
                id="fuel-prices-api",
                title="Fuel Prices REST API",
                description="Real-time retail fuel pricing data by distributor type.",
                category="Economy",
                method="GET",
                endpoint="/api/v1/energy/fuel-prices",
                pricing="Developer",
                status="active",
                dataset_id="monthly-fuel-prices"
            ),
            models.APISpec(
                id="health-stats-api",
                title="Public Health Indicators API",
                description="Weekly infectious disease statistics and vaccination data.",
                category="Health",
                method="GET",
                endpoint="/api/v1/health/indicators",
                pricing="Developer",
                status="active",
                dataset_id="public-health-indicators"
            ),
            models.APISpec(
                id="weather-forecast-api",
                title="Precipitation & Weather API",
                description="Precipitation parameters, monsoon models, and weather warnings.",
                category="Weather",
                method="GET",
                endpoint="/api/v1/weather/forecast",
                pricing="Free",
                status="beta",
                dataset_id=None
            ),
        ]

        for api in apis_data:
            exists = db.query(models.APISpec).filter_by(id=api.id).first()
            if not exists:
                db.add(api)

        db.commit()
        print("✓ API specs seeded.")

        print("\n🎉 LankaData Hub database seeded successfully!")

    except Exception as e:
        db.rollback()
        print(f"❌ Error seeding data: {e}")
        raise e
    finally:
        db.close()


if __name__ == "__main__":
    create_tables()
    seed_data()
