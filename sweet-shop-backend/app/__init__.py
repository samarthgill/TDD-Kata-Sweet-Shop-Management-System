from flask import Flask, jsonify
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from app.models import mongo, bcrypt
from config import config

jwt = JWTManager()

def create_app(config_name='default'):
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object(config[config_name])
    
    # Initialize extensions
    mongo.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    CORS(app, supports_credentials=True, origins=["http://localhost:3000"])
    
    # Register blueprints
    from .auth.routes import auth_bp
    from .sweets.routes import sweets_bp
    from .inventory.routes import inventory_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(sweets_bp, url_prefix='/api/sweets')
    app.register_blueprint(inventory_bp, url_prefix='/api/sweets')
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Not found'}), 404
        
    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({'error': 'Internal server error'}), 500
    
    # Test route
    @app.route('/')
    def home():
        return jsonify({'message': 'TDD Kata Sweet Shop Backend API'})
    
    @app.route('/api/health')
    def health():
        return jsonify({'status': 'healthy', 'service': 'sweet-shop-api'})
    
    return app