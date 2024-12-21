# routes/content.py
from flask import Blueprint, jsonify

content_bp = Blueprint('content', __name__)

@content_bp.route('/api/question', methods=['GET'])
def get_question():
    # For now, return a hard-coded question.
    # Later, integrate with UserProgress and a question generation service.
    sample_question = {
        "question_text": "What is the acceleration due to gravity on Earth?",
        "options": ["9.8 m/s²", "1 m/s²", "0 m/s²", "9.8 km/s²"],
        "correct_answer": "9.8 m/s²"
    }
    return jsonify(sample_question), 200
