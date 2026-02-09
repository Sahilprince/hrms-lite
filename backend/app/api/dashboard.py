from flask import Blueprint, jsonify
from app.services.dashboard_service import get_dashboard_summary

dashboard_bp = Blueprint("dashboard", __name__)


@dashboard_bp.route("/dashboard", methods=["GET"])
def dashboard_summary_route():

    response, status_code = get_dashboard_summary()
    return jsonify(response), status_code
