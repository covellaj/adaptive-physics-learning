# src/backend/database/__init__.py
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
# Get the absolute path to the project root
DATABASE_URL = f"sqlite:///{os.path.join(BASE_DIR, 'data', 'dev.db')}"

engine = create_engine(DATABASE_URL, echo=True, future=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
