# routes/user.py
from flask import Blueprint, request, jsonify
from sqlalchemy.orm import Session
from database import SessionLocal
from models.user_state import User
import bcrypt
import jwt
import os
from datetime import datetime, timedelta

user_bp = Blueprint('user', __name__)

# Use a secure secret key in production
JWT_SECRET = os.environ.get('JWT_SECRET', 'your-secret-key')
JWT_EXPIRATION_HOURS = 24

def generate_token(user_id: int) -> str:
    expiration = datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS)
    return jwt.encode(
        {'user_id': user_id, 'exp': expiration},
        JWT_SECRET,
        algorithm='HS256'
    )

@user_bp.route('/api/auth/register', methods=['POST'])
def register_user():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not email or not password or not name:
        return jsonify({"error": "Missing required fields"}), 400
    
    # Hash password
    salt = bcrypt.gensalt()
    password_hash = bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

    db: Session = SessionLocal()
    try:
        # Check if user already exists
        existing_user = db.query(User).filter_by(email=email).first()
        if existing_user:
            return jsonify({"error": "User already exists"}), 400

        new_user = User(name=name, email=email, password_hash=password_hash)
        db.add(new_user)
        db.commit()
        
        # Generate token
        token = generate_token(new_user.id)
        
        return jsonify({
            "message": "User registered successfully",
            "token": token,
            "user": {
                "id": new_user.id,
                "name": new_user.name,
                "email": new_user.email
            }
        }), 201
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()

@user_bp.route('/api/auth/login', methods=['POST'])
def login_user():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Missing email or password"}), 400
    
    db: Session = SessionLocal()
    try:
        user = db.query(User).filter_by(email=email).first()
        if not user:
            return jsonify({"error": "Invalid email or password"}), 401
        
        # Verify password
        if not bcrypt.checkpw(password.encode('utf-8'), user.password_hash.encode('utf-8')):
            return jsonify({"error": "Invalid email or password"}), 401
        
        # Generate token
        token = generate_token(user.id)
        
        return jsonify({
            "message": "Login successful",
            "token": token,
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email
            }
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()

@user_bp.route('/api/auth/verify', methods=['GET'])
def verify_token():
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({"error": "No token provided"}), 401
    
    token = auth_header.split(' ')[1]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
        db: Session = SessionLocal()
        user = db.query(User).filter_by(id=payload['user_id']).first()
        db.close()
        
        if not user:
            return jsonify({"error": "User not found"}), 401
            
        return jsonify({
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email
            }
        }), 200
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token has expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": "Invalid token"}), 401
