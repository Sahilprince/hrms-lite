from flask import Blueprint, request, jsonify
from app.services.employee_service import (
    create_employee,
    get_all_employees,
    get_all_employees_grouped,
    get_employees_by_dept,
    delete_employee,
    get_grouped_employees_with_attendance
)

employees_bp = Blueprint("employees", __name__)


def build_response(service_call):
    # Common response handler for all routes
    
    response, status_code = service_call
    return jsonify(response), status_code


@employees_bp.route("/employees", methods=["POST"])
def add_employee_route():
    data = request.get_json(silent=True) or {}
    return build_response(create_employee(data))


@employees_bp.route("/employees", methods=["GET"])
def list_all_employees_route():
    return build_response(get_all_employees())


@employees_bp.route("/employees/grouped", methods=["GET"])
def list_grouped_employees_route():
    return build_response(get_all_employees_grouped())


@employees_bp.route("/grouped", methods=["GET"])
def fetch_grouped_with_attendance():
    return build_response(get_grouped_employees_with_attendance())


@employees_bp.route("/employees/department/<dept_name>", methods=["GET"])
def list_dept_employees_route(dept_name):
    return build_response(get_employees_by_dept(dept_name))


@employees_bp.route("/employees/<emp_id>", methods=["DELETE"])
def remove_employee_route(emp_id):
    return build_response(delete_employee(emp_id))
