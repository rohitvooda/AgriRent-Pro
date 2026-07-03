from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .middleware.auth import AuditLogMiddleware
from .routers import (
    auth_router,
    users_router,
    equipment_router,
    bookings_router,
    payments_router,
    reviews_router,
    admin_router
)

# Automatically create database tables if they do not exist.
# In a full production setup, Alembic migrations are preferred,
# but this is extremely convenient for initial runs and development.
try:
    Base.metadata.create_all(bind=engine)
    # Seed mock data if database is empty
    def seed_data():
        from .database import SessionLocal
        from .models.user import User
        from .models.equipment import Equipment
        from .utils.hash import hash_password
        db = SessionLocal()
        try:
            if db.query(User).count() == 0:
                owner = User(
                    name="Ramesh Singh (Owner)",
                    email="owner@agrirent.com",
                    hashed_password=hash_password("owner123"),
                    role="owner",
                    phone="+91 98765 00001",
                    address="Patiala, Punjab"
                )
                farmer = User(
                    name="Suresh Kumar (Farmer)",
                    email="farmer@agrirent.com",
                    hashed_password=hash_password("farmer123"),
                    role="farmer",
                    phone="+91 98765 00002",
                    address="Nabha, Punjab"
                )
                admin = User(
                    name="Platform Admin",
                    email="admin@agrirent.com",
                    hashed_password=hash_password("admin123"),
                    role="admin",
                    phone="+91 98765 00003",
                    address="New Delhi"
                )
                db.add_all([owner, farmer, admin])
                db.commit()
                db.refresh(owner)

                equip1 = Equipment(
                    name="John Deere 5050D Tractor (50 HP)",
                    category="Tractor",
                    price_per_day=2200.00,
                    location="Patiala, Punjab",
                    description="Power steering, dual clutch, 8 forward + 4 reverse gears, ideal for heavy cultivation and rotavator operations.",
                    is_available=True,
                    owner_id=owner.id,
                    image_url="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80"
                )
                equip2 = Equipment(
                    name="Mahindra Arjun Combined Harvester",
                    category="Harvester",
                    price_per_day=4500.00,
                    location="Ludhiana, Punjab",
                    description="Self-propelled combine harvester with high cleaning efficiency and low crop loss rates.",
                    is_available=True,
                    owner_id=owner.id,
                    image_url="https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80"
                )
                equip3 = Equipment(
                    name="Rotary Tiller Rotavator (42 Blades)",
                    category="Rotavator",
                    price_per_day=950.00,
                    location="Amritsar, Punjab",
                    description="Heavy duty gear drive rotavator suitable for mixing crop residues and refining soil structure.",
                    is_available=True,
                    owner_id=owner.id,
                    image_url="https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=800&q=80"
                )
                db.add_all([equip1, equip2, equip3])
                db.commit()
                print("[Database] Successfully seeded mock data.")
        except Exception as e:
            print(f"[Database] Error seeding mock data: {e}")
        finally:
            db.close()
    
    seed_data()
except Exception as e:
    print(f"Warning: Could not automatically run create_all on startup: {e}")
    print("If you are using PostgreSQL, make sure the database exists and the connection URL is correct.")

app = FastAPI(
    title="AgriRent Pro API",
    description="REST API backend services for the AgriRent Pro agricultural equipment rental platform.",
    version="1.0.0"
)

# Apply CORS middleware to allow React application integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Set to specific client origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Apply audit logging middleware
app.add_middleware(AuditLogMiddleware)

# Include all the sub-routers
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(equipment_router)
app.include_router(bookings_router)
app.include_router(payments_router)
app.include_router(reviews_router)
app.include_router(admin_router)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "message": "Welcome to the AgriRent Pro API",
        "docs_url": "/docs"
    }
