# src/backend/routes/adapt.py
from flask import Blueprint, request, jsonify
from database import SessionLocal
from models.user_state import UserProgress
from services.question_generation_service import check_answer

adapt_bp = Blueprint('adapt', __name__)

@adapt_bp.route('/api/submit_answer', methods=['POST'])
def submit_answer():
    data = request.json
    user_id = data.get('user_id')
    question_id = data.get('question_id')
    user_answer = data.get('answer')

    if not user_id or not question_id or user_answer is None:
        return jsonify({"error": "Missing required fields (user_id, question_id, answer)"}), 400

    db = SessionLocal()
    # Fetch user progress
    progress = db.query(UserProgress).filter(UserProgress.user_id == user_id).first()

    if not progress:
        # If user has no progress entry yet, create one
        progress = UserProgress(user_id=user_id, current_concept="basic_gravity", difficulty_level=1)
        db.add(progress)
        db.commit()

    # Check answer correctness
    is_correct, correct_ans = check_answer(question_id, user_answer)

    # Update difficulty based on correctness
    if is_correct:
        # Increase difficulty level by 1 if correct
        progress.difficulty_level = progress.difficulty_level + 1
    else:
        # If incorrect, you can either keep the same difficulty or decrease it slightly
        progress.difficulty_level = max(1, progress.difficulty_level - 1)

    db.commit()
    db.close()

    response = {
        "is_correct": is_correct,
        "correct_answer": correct_ans,
        "new_difficulty_level": progress.difficulty_level
    }

    return jsonify(response), 200
