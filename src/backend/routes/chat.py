from flask import Blueprint, request, jsonify
from services.ai_manager import AIManager
import jwt
import os
from functools import wraps

chat_bp = Blueprint('chat', __name__)
ai_manager = AIManager()

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        auth_header = request.headers.get('Authorization')
        
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
            
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
            
        try:
            data = jwt.decode(token, os.getenv('JWT_SECRET'), algorithms=['HS256'])
            current_user_id = str(data['user_id'])
        except:
            return jsonify({'error': 'Token is invalid'}), 401
            
        return f(current_user_id, *args, **kwargs)
    
    return decorated

@chat_bp.route('/api/chat/message', methods=['POST'])
@token_required
def send_message(current_user_id):
    data = request.get_json()
    message = data.get('message')
    
    if not message:
        return jsonify({'error': 'Message is required'}), 400
        
    try:
        # Get selected model from request
        model = data.get('model', 'gpt4')
        response = ai_manager.get_response(current_user_id, message, model)
        return jsonify({
            'response': response,
            'success': True,
            'model': model
        })
    except Exception as e:
        print(f"Error in chat route: {str(e)}")
        return jsonify({
            'error': 'Failed to get response from AI Manager',
            'success': False
        }), 500

@chat_bp.route('/api/chat/history', methods=['GET'])
@token_required
def get_history(current_user_id):
    history = ai_manager.get_conversation_history(current_user_id)
    # Filter out system messages and format for frontend
    formatted_history = [
        {
            'role': msg['role'],
            'content': msg['content']
        }
        for msg in history
        if msg['role'] != 'system'
    ]
    return jsonify({
        'history': formatted_history,
        'success': True
    })

@chat_bp.route('/api/chat/clear', methods=['POST'])
@token_required
def clear_history(current_user_id):
    ai_manager.clear_history(current_user_id)
    return jsonify({
        'message': 'Chat history cleared',
        'success': True
    })