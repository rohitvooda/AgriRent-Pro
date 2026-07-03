from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from .config import settings

db_url = settings.DATABASE_URL
connect_args = {}

if db_url.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

try:
    # Test the connection to PostgreSQL or configured database
    engine = create_engine(db_url, connect_args=connect_args)
    connection = engine.connect()
    connection.close()
except Exception as e:
    print(f"\n[Database Warning] Connection to database URL '{db_url}' failed: {e}")
    print("[Database Warning] Falling back to local SQLite database: 'sqlite:///./agrirent.db'\n")
    db_url = "sqlite:///./agrirent.db"
    engine = create_engine(db_url, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
