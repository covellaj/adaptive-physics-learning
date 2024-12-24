from flask import Flask, send_from_directory, request
from flask_cors import CORS
from routes.user import user_bp
from routes.content import content_bp
from routes.adapt import adapt_bp
from routes.chat import chat_bp
from database.init_db import init_db

from flask_cors import CORS

import os
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def create_app():
    # Initialize the database
    init_db()
    logger.debug("Database initialized")
    
    static_folder = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend', 'src'))
    app = Flask(__name__, static_folder=None)  # Disable default static handling

    # Configure CORS - must be first
    CORS(app, 
         resources={r"/api/*": {"origins": "http://localhost:8000"}},
         allow_headers=["Content-Type", "Authorization"],
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])

    # Log requests for debugging
    @app.after_request
    def after_request(response):
        print(f"\n=== {request.method} {request.path} ===")
        print("Request Headers:")
        for name, value in request.headers.items():
            print(f"  {name}: {value}")
        print("\nResponse Headers:")
        for name, value in response.headers.items():
            print(f"  {name}: {value}")
        print("===========================\n")
        return response
    
    @app.route('/')
    def serve_index():
        logger.debug("Serving index.html")
        return send_from_directory(static_folder, 'index.html')
    
    @app.route('/<path:path>')
    def serve_static(path):
        logger.debug(f"Serving static file: {path}")
        return send_from_directory(static_folder, path)
    
    # Register Blueprints
    app.register_blueprint(user_bp)
    app.register_blueprint(content_bp)
    app.register_blueprint(adapt_bp)  # Register adapt blueprint
    app.register_blueprint(chat_bp)   # Register chat blueprint
    return app

if __name__ == '__main__':
    app = create_app()
    # Run on a different port if 5000 is taken
    app.run(host='0.0.0.0', port=5504, debug=True)
