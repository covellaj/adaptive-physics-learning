from flask import Flask
from flask_cors import CORS
from routes.user import user_bp
from routes.content import content_bp
from routes.adapt import adapt_bp
from database.init_db import init_db
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def create_app():
    # Initialize the database
    init_db()
    logger.debug("Database initialized")
    
    app = Flask(__name__)
    
    # Enable CORS for all routes
    CORS(app, resources={
        r"/api/*": {  # Enable CORS for all API routes
            "origins": ["http://localhost:8000"],  # Allow requests from frontend server
            "methods": ["GET", "POST", "PUT", "DELETE"],  # Allow all methods
            "allow_headers": ["Content-Type", "Authorization"]  # Allow these headers
        }
    })
    
    # Register Blueprints
    app.register_blueprint(user_bp)
    app.register_blueprint(content_bp)
    app.register_blueprint(adapt_bp)
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=True)