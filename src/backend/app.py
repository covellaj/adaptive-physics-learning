from flask import Flask
from routes.user import user_bp
from routes.content import content_bp
from routes.adapt import adapt_bp

def create_app():
    app = Flask(__name__)
    # Register Blueprints
    app.register_blueprint(user_bp)
    app.register_blueprint(content_bp)
    app.register_blueprint(adapt_bp)  # Register adapt blueprint
    return app

if __name__ == '__main__':
    app = create_app()
    # Run on a different port if 5000 is taken
    app.run(host='0.0.0.0', port=5500, debug=True)
