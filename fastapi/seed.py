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
                id="usd-exchange-rates",
                title="USD Exchange Rates",
                description="Historical daily USD buying and selling exchange rates published by the Central Bank of Sri Lanka.",
                full_description="Historical daily USD buying and selling exchange rates published by the Central Bank of Sri Lanka. Spanning multi-year daily records, this dataset offers essential indicators for financial modeling, import-export analysis, and macroeconomic forecasting.",
                category_id="economy",
                formats="CSV,JSON,SQL",
                maintainer="Central Bank of Sri Lanka",
                source="Central Bank of Sri Lanka",
                frequency="Daily",
                coverage="2005 - Present",
                live=True,
                featured=True,
                views=5640,
                downloads=1820,
                total_records=5620,
                file_size="12.4 MB"
            ),
            models.Dataset(
                id="hnb-usd-rates",
                title="HNB USD Exchange Rates",
                description="Daily USD buying, selling, and telegraphic transfer (TT) exchange rates published by Hatton National Bank.",
                full_description="Daily commercial bank exchange rates for US Dollars published by Hatton National Bank (HNB PLC). Tracks counter buying, counter selling, and telegraphic transfer (TT) rates across business days.",
                category_id="economy",
                formats="CSV,JSON,SQL",
                maintainer="Hatton National Bank",
                source="Hatton National Bank",
                frequency="Daily",
                coverage="2015 - Present",
                live=True,
                featured=True,
                views=3120,
                downloads=950,
                total_records=2840,
                file_size="6.8 MB"
            ),
        ]

        for ds in datasets_data:
            existing = db.query(models.Dataset).filter_by(id=ds.id).first()
            if not existing:
                db.add(ds)
            else:
                existing.title = ds.title
                existing.description = ds.description
                existing.full_description = ds.full_description
                existing.source = ds.source
                existing.maintainer = ds.maintainer
                existing.frequency = ds.frequency
                existing.coverage = ds.coverage
                existing.total_records = ds.total_records
                existing.file_size = ds.file_size

        db.commit()
        print("✓ Datasets seeded.")

        # ─── Seed Dataset Records ─────────────────────────────────────────────
        import json
        
        # CBSL USD Rates sample historical daily rows
        cbsl_rows = [
            {"Date": "2024-08-01", "Buying Rate (LKR)": 302.50, "Selling Rate (LKR)": 308.20},
            {"Date": "2024-07-31", "Buying Rate (LKR)": 302.10, "Selling Rate (LKR)": 307.80},
            {"Date": "2024-07-30", "Buying Rate (LKR)": 301.90, "Selling Rate (LKR)": 307.50},
            {"Date": "2024-07-29", "Buying Rate (LKR)": 301.60, "Selling Rate (LKR)": 307.20},
            {"Date": "2024-07-26", "Buying Rate (LKR)": 301.20, "Selling Rate (LKR)": 306.90},
            {"Date": "2024-07-25", "Buying Rate (LKR)": 300.90, "Selling Rate (LKR)": 306.50},
            {"Date": "2024-07-24", "Buying Rate (LKR)": 300.50, "Selling Rate (LKR)": 306.10},
            {"Date": "2024-07-23", "Buying Rate (LKR)": 300.20, "Selling Rate (LKR)": 305.80},
            {"Date": "2024-07-22", "Buying Rate (LKR)": 299.80, "Selling Rate (LKR)": 305.40},
            {"Date": "2024-07-19", "Buying Rate (LKR)": 299.50, "Selling Rate (LKR)": 305.10},
            {"Date": "2024-07-18", "Buying Rate (LKR)": 299.10, "Selling Rate (LKR)": 304.70},
            {"Date": "2024-07-17", "Buying Rate (LKR)": 298.80, "Selling Rate (LKR)": 304.40},
            {"Date": "2024-07-16", "Buying Rate (LKR)": 298.50, "Selling Rate (LKR)": 304.00},
            {"Date": "2024-07-15", "Buying Rate (LKR)": 298.20, "Selling Rate (LKR)": 303.70},
            {"Date": "2024-07-12", "Buying Rate (LKR)": 297.90, "Selling Rate (LKR)": 303.40},
            {"Date": "2024-07-11", "Buying Rate (LKR)": 297.50, "Selling Rate (LKR)": 303.00},
            {"Date": "2024-07-10", "Buying Rate (LKR)": 297.20, "Selling Rate (LKR)": 302.70},
            {"Date": "2024-07-09", "Buying Rate (LKR)": 296.80, "Selling Rate (LKR)": 302.30},
            {"Date": "2024-07-08", "Buying Rate (LKR)": 296.50, "Selling Rate (LKR)": 302.00},
            {"Date": "2024-07-05", "Buying Rate (LKR)": 296.10, "Selling Rate (LKR)": 301.60},
        ]

        if db.query(models.DatasetRecord).filter_by(dataset_id="usd-exchange-rates").count() == 0:
            for row in cbsl_rows:
                db.add(models.DatasetRecord(
                    dataset_id="usd-exchange-rates",
                    year=row["Date"][:4],
                    region="National",
                    indicator_value=row["Buying Rate (LKR)"],
                    growth_pct=0.0,
                    extra_data=json.dumps(row)
                ))

        # HNB USD Rates sample historical daily rows
        hnb_rows = [
            {"Date": "2024-08-01", "Buying Rate (LKR)": 301.80, "Selling Rate (LKR)": 309.00, "TT Buying Rate (LKR)": 300.50},
            {"Date": "2024-07-31", "Buying Rate (LKR)": 301.50, "Selling Rate (LKR)": 308.70, "TT Buying Rate (LKR)": 300.20},
            {"Date": "2024-07-30", "Buying Rate (LKR)": 301.20, "Selling Rate (LKR)": 308.40, "TT Buying Rate (LKR)": 299.90},
            {"Date": "2024-07-29", "Buying Rate (LKR)": 300.90, "Selling Rate (LKR)": 308.10, "TT Buying Rate (LKR)": 299.60},
            {"Date": "2024-07-26", "Buying Rate (LKR)": 300.50, "Selling Rate (LKR)": 307.70, "TT Buying Rate (LKR)": 299.20},
            {"Date": "2024-07-25", "Buying Rate (LKR)": 300.20, "Selling Rate (LKR)": 307.40, "TT Buying Rate (LKR)": 298.90},
            {"Date": "2024-07-24", "Buying Rate (LKR)": 299.80, "Selling Rate (LKR)": 307.00, "TT Buying Rate (LKR)": 298.50},
            {"Date": "2024-07-23", "Buying Rate (LKR)": 299.50, "Selling Rate (LKR)": 306.70, "TT Buying Rate (LKR)": 298.20},
            {"Date": "2024-07-22", "Buying Rate (LKR)": 299.10, "Selling Rate (LKR)": 306.30, "TT Buying Rate (LKR)": 297.80},
            {"Date": "2024-07-19", "Buying Rate (LKR)": 298.80, "Selling Rate (LKR)": 306.00, "TT Buying Rate (LKR)": 297.50},
            {"Date": "2024-07-18", "Buying Rate (LKR)": 298.40, "Selling Rate (LKR)": 305.60, "TT Buying Rate (LKR)": 297.10},
            {"Date": "2024-07-17", "Buying Rate (LKR)": 298.10, "Selling Rate (LKR)": 305.30, "TT Buying Rate (LKR)": 296.80},
            {"Date": "2024-07-16", "Buying Rate (LKR)": 297.80, "Selling Rate (LKR)": 304.90, "TT Buying Rate (LKR)": 296.50},
            {"Date": "2024-07-15", "Buying Rate (LKR)": 297.50, "Selling Rate (LKR)": 304.60, "TT Buying Rate (LKR)": 296.20},
            {"Date": "2024-07-12", "Buying Rate (LKR)": 297.10, "Selling Rate (LKR)": 304.20, "TT Buying Rate (LKR)": 295.80},
            {"Date": "2024-07-11", "Buying Rate (LKR)": 296.80, "Selling Rate (LKR)": 303.90, "TT Buying Rate (LKR)": 295.50},
            {"Date": "2024-07-10", "Buying Rate (LKR)": 296.40, "Selling Rate (LKR)": 303.50, "TT Buying Rate (LKR)": 295.10},
            {"Date": "2024-07-09", "Buying Rate (LKR)": 296.10, "Selling Rate (LKR)": 303.20, "TT Buying Rate (LKR)": 294.80},
            {"Date": "2024-07-08", "Buying Rate (LKR)": 295.80, "Selling Rate (LKR)": 302.80, "TT Buying Rate (LKR)": 294.50},
            {"Date": "2024-07-05", "Buying Rate (LKR)": 295.40, "Selling Rate (LKR)": 302.40, "TT Buying Rate (LKR)": 294.10},
        ]

        if db.query(models.DatasetRecord).filter_by(dataset_id="hnb-usd-rates").count() == 0:
            for row in hnb_rows:
                db.add(models.DatasetRecord(
                    dataset_id="hnb-usd-rates",
                    year=row["Date"][:4],
                    region="National",
                    indicator_value=row["Buying Rate (LKR)"],
                    growth_pct=0.0,
                    extra_data=json.dumps(row)
                ))

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
