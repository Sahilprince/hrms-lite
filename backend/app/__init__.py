from flask import Flask, jsonify
from flask_cors import CORS
from app.api.employees import employees_bp
from app.api.attendance import attendance_bp
from app.database.mongo import init_db, test_connection
from app.api.dashboard import dashboard_bp


def create_app():
    app = Flask(__name__)
    
    # Enable CORS for all routes (Mandatory for React <-> Flask)
    CORS(app)
    
    # Check DB connection
    test_connection() 
    
    # Register Blueprints
    app.register_blueprint(employees_bp, url_prefix='/api')
    app.register_blueprint(attendance_bp, url_prefix='/api')
    app.register_blueprint(dashboard_bp, url_prefix='/api')

    # Initialize Database Indexes
    with app.app_context():
        init_db()

    # Global Error Handler for unhandled exceptions
    @app.errorhandler(500)
    def handle_500(e):
        return jsonify({"error": "Internal server error"}), 500

    @app.route('/health', methods=['GET'])
    def health_check():
        return jsonify({"status": "healthy"}), 200

    return app