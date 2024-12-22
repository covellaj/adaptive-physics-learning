# src/backend/database/init_db.py
from . import engine
from models.user_state import Base

def init_db():
    # Create tables if they don't exist
    Base.metadata.create_all(bind=engine)
    print("Database initialized successfully")
