# routes/user.py
from flask import Blueprint, request, jsonify
from sqlalchemy.orm import Session
from database import SessionLocal
from models.user_state import User  # Ensure this matches your actual model name/path

user_bp = Blueprint('user', __name__)

@user_bp.route('/api/register', methods=['POST'])
def register_user():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    if not username or not password:
        return jsonify({"error": "Missing username or password"}), 400
    
    # Simple password hash = password as is (in real code, use a hashing lib)
    password_hash = password

    db: Session = SessionLocal()
    # Check if user already exists
    existing_user = db.query(User).filter_by(username=username).first()
    if existing_user:
        db.close()
        return jsonify({"error": "User already exists"}), 400

    new_user = User(username=username, password_hash=password_hash)
    db.add(new_user)
    db.commit()
    db.close()
    return jsonify({"message": "User registered successfully"}), 201


@user_bp.route('/api/login', methods=['POST'])
def login_user():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Missing username or password"}), 400
    
    db: Session = SessionLocal()
    user = db.query(User).filter_by(username=username).first()
    if not user:
        db.close()
        return jsonify({"error": "Invalid username or password"}), 401
    
    # Compare password with stored password_hash
    if password != user.password_hash:
        db.close()
        return jsonify({"error": "Invalid username or password"}), 401
    
    # For now, just return a simple success message.
    # Later, we can return a JWT or session token.
    db.close()
    return jsonify({"message": "Login successful", "user_id": user.id}), 200
