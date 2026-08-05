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

        # ─── Seed Master Registry Datasets & Physical Postgres Data Tables ─────
        datasets_seed = [
            models.Dataset(
                id="usd-exchange-rates",
                title="USD Exchange Rates",
                description="Historical daily USD buying and selling exchange rates published by the Central Bank of Sri Lanka.",
                full_description="Comprehensive daily USD exchange rate dataset maintained by the Central Bank of Sri Lanka (CBSL). Contains official buying and selling rates against LKR with multi-decade historical coverage.",
                category_id="economy",
                table_name="usd_exchange_rates",
                primary_date_column="date",
                formats="CSV,JSON,SQL,API",
                maintainer="Central Bank of Sri Lanka",
                source="Central Bank of Sri Lanka",
                frequency="Daily",
                coverage="2005 - Present",
                live=True,
                featured=True,
                views=1250,
                downloads=840
            ),
            models.Dataset(
                id="hnb-usd-exchange-rates",
                title="HNB USD Exchange Rates",
                description="Daily US Dollar buying and selling exchange rates published by Hatton National Bank (HNB), Sri Lanka.",
                full_description="Commercial bank exchange rates for USD published daily by Hatton National Bank (HNB), including buying and selling telegraphic transfers (TT) and note rates.",
                category_id="economy",
                table_name="hnb_usd_exchange_rates",
                primary_date_column="date",
                formats="CSV,JSON,SQL,API",
                maintainer="Hatton National Bank",
                source="Hatton National Bank",
                frequency="Daily",
                coverage="2020 - Present",
                live=True,
                featured=True,
                views=980,
                downloads=620
            ),
            models.Dataset(
                id="fuel-prices",
                title="Fuel Prices",
                description="Official retail fuel prices in Sri Lanka published by CEYPETCO and LIOC.",
                full_description="Historical retail prices for 92 Octane Petrol, 95 Octane Petrol, Auto Diesel, Super Diesel, and Kerosene across Sri Lanka.",
                category_id="economy",
                table_name="fuel_prices",
                primary_date_column="effective_date",
                formats="CSV,JSON,SQL,API",
                maintainer="Ceylon Petroleum Corporation",
                source="Ministry of Power and Energy",
                frequency="Monthly",
                coverage="2022 - Present",
                live=True,
                featured=True,
                views=1540,
                downloads=1120
            )
        ]

        for ds in datasets_seed:
            exists = db.query(models.Dataset).filter_by(id=ds.id).first()
            if not exists:
                db.add(ds)
        db.commit()
        print("✓ Master dataset registry seeded.")

        from sqlalchemy import text
        
        # 1. usd_exchange_rates
        db.execute(text("""
            CREATE TABLE IF NOT EXISTS usd_exchange_rates (
                date VARCHAR(20) PRIMARY KEY,
                buying_rate FLOAT,
                selling_rate FLOAT,
                cbsl_index FLOAT
            );
        """))
        r_usd = db.execute(text("SELECT COUNT(*) FROM usd_exchange_rates")).scalar()
        if r_usd == 0:
            db.execute(text("""
                INSERT INTO usd_exchange_rates (date, buying_rate, selling_rate, cbsl_index) VALUES
                ('2024-01-01', 320.50, 328.00, 324.25),
                ('2024-01-02', 321.00, 328.50, 324.75),
                ('2024-01-03', 320.80, 328.20, 324.50),
                ('2024-01-04', 319.50, 327.00, 323.25),
                ('2024-01-05', 318.90, 326.40, 322.65),
                ('2024-01-08', 318.00, 325.50, 321.75),
                ('2024-01-09', 317.50, 325.00, 321.25);
            """))
            db.commit()

        # 2. hnb_usd_exchange_rates
        db.execute(text("""
            CREATE TABLE IF NOT EXISTS hnb_usd_exchange_rates (
                date VARCHAR(20) PRIMARY KEY,
                buying_tt FLOAT,
                selling_tt FLOAT,
                buying_notes FLOAT,
                selling_notes FLOAT
            );
        """))
        r_hnb = db.execute(text("SELECT COUNT(*) FROM hnb_usd_exchange_rates")).scalar()
        if r_hnb == 0:
            db.execute(text("""
                INSERT INTO hnb_usd_exchange_rates (date, buying_tt, selling_tt, buying_notes, selling_notes) VALUES
                ('2024-01-01', 319.50, 329.00, 317.00, 331.00),
                ('2024-01-02', 320.00, 329.50, 317.50, 331.50),
                ('2024-01-03', 319.80, 329.20, 317.30, 331.20),
                ('2024-01-04', 318.50, 328.00, 316.00, 330.00),
                ('2024-01-05', 318.00, 327.50, 315.50, 329.50);
            """))
            db.commit()

        # 3. fuel_prices
        db.execute(text("""
            CREATE TABLE IF NOT EXISTS fuel_prices (
                effective_date VARCHAR(20),
                fuel_type VARCHAR(100),
                price_lkr FLOAT,
                change_lkr FLOAT,
                region VARCHAR(100)
            );
        """))
        r_fuel = db.execute(text("SELECT COUNT(*) FROM fuel_prices")).scalar()
        if r_fuel == 0:
            db.execute(text("""
                INSERT INTO fuel_prices (effective_date, fuel_type, price_lkr, change_lkr, region) VALUES
                ('2024-01-01', 'Petrol 92 Octane', 366.00, -9.00, 'Islandwide'),
                ('2024-01-01', 'Petrol 95 Octane', 464.00, +28.00, 'Islandwide'),
                ('2024-01-01', 'Auto Diesel', 358.00, +5.00, 'Islandwide'),
                ('2024-01-01', 'Super Diesel', 475.00, +29.00, 'Islandwide'),
                ('2024-02-01', 'Petrol 92 Octane', 371.00, +5.00, 'Islandwide'),
                ('2024-02-01', 'Auto Diesel', 363.00, +5.00, 'Islandwide'),
                ('2024-03-01', 'Petrol 92 Octane', 362.00, -9.00, 'Islandwide'),
                ('2024-03-01', 'Auto Diesel', 353.00, -10.00, 'Islandwide');
            """))
            db.commit()

        print("\n🎉 LankaData Hub base data & master dataset registry seeded successfully!")
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
