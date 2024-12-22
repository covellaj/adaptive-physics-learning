# src/backend/database/init_db.py
from . import engine
from ..models.user_state import Base

def init_db():
    Base.metadata.create_all(bind=engine)
