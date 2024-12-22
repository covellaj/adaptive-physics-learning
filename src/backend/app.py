from flask import Flask, send_from_directory
from flask_cors import CORS
from routes.user import user_bp
from routes.content import content_bp
from routes.adapt import adapt_bp
from database.init_db import init_db
import os
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def create_app():
    # Initialize the database
    init_db()
    logger.debug("Database initialized")
    
    static_folder = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend', 'src'))
    logger.debug(f"Static folder path: {static_folder}")
    logger.debug(f"Static folder exists: {os.path.exists(static_folder)}")
    logger.debug(f"Static folder contents: {os.listdir(static_folder)}")
    
    app = Flask(__name__, static_folder=None)  # Disable default static handling
    
    # Enable CORS for all routes
    CORS(app, resources={
        r"/api/*": {  # Enable CORS for all API routes
            "origins": ["http://localhost:8000"],  # Allow requests from frontend server
            "methods": ["GET", "POST", "PUT", "DELETE"],  # Allow all methods
            "allow_headers": ["Content-Type", "Authorization"]  # Allow these headers
        }
    })
    
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
    return app

if __name__ == '__main__':
    app = create_app()
    # Run on a different port if 5000 is taken
    app.run(host='0.0.0.0', port=5504, debug=True)
