from flask import Blueprint, request, jsonify
from app.services.attendance_service import (
    mark_attendance, 
    get_employee_attendance,
    filter_attendance_by_date,
    get_present_days_per_employee
)


attendance_bp = Blueprint('attendance', __name__)

@attendance_bp.route('/attendance', methods=['POST'])
def log_attendance_route():
    # Mark attendance for an employee
    data = request.get_json()
    response, status_code = mark_attendance(data)
    return jsonify(response), status_code

@attendance_bp.route('/attendance/employee/<emp_id>', methods=['GET'])
def get_employee_attendance_route(emp_id):
    # View attendance records for an employee
    response, status_code = get_employee_attendance(emp_id)
    return jsonify(response), status_code

@attendance_bp.route('/attendance/filter', methods=['GET'])
def filter_attendance_route():

    from_date = request.args.get("from")
    to_date = request.args.get("to")

    response, status_code = filter_attendance_by_date(from_date, to_date)
    return jsonify(response), status_code


@attendance_bp.route('/attendance/present-summary', methods=['GET'])
def present_days_summary_route():

    response, status_code = get_present_days_per_employee()
    return jsonify(response), status_code