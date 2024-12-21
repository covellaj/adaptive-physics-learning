# src/backend/services/question_generation_service.py
# This is a placeholder service. Later, you can expand it to parameterize questions.

def get_correct_answer(question_id):
    # For now, let’s assume we only have one question (id=1) about gravity:
    # In the future, this could query a database or a dictionary of questions
    if question_id == 1:
        return "9.8 m/s²"
    # Default fallback
    return None

def check_answer(question_id, user_answer):
    correct = get_correct_answer(question_id)
    return correct == user_answer, correct
