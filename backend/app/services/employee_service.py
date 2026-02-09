from collections import defaultdict
from datetime import datetime
from pydantic import ValidationError

from app.database.mongo import (
    employees_col,
    attendance_col,
    get_next_employee_id
)
from app.schema.employee import EmployeeSchema

def _safe_int(value):
    try:
        return int(value)
    except (TypeError, ValueError):
        return None


def _service_error(message, status=500):
    return {"error": message}, status


def _fetch_all_employees():
    return list(employees_col.find({}, {"_id": 0}))


def _group_employees(employees):
    grouped = defaultdict(list)
    for emp in employees:
        dept = emp.get("department") or "Unassigned"
        grouped[dept].append(emp)
    return dict(grouped)

def create_employee(data):
    try:
        validated_data = EmployeeSchema(**data)

        if employees_col.find_one({"email": validated_data.email}):
            return {"error": "Employee with this email already exists"}, 409

        validated_data.employee_id = get_next_employee_id()

        employees_col.insert_one(validated_data.model_dump())

        return {
            "message": "Employee added successfully",
            "employee_id": validated_data.employee_id
        }, 201

    except ValidationError as e:
        return {
        "error": e.errors(include_url=False, include_context=False)
    }, 422


    except Exception:
        return _service_error("Internal server error")


def get_all_employees():
    try:
        employees = _fetch_all_employees()
        return employees, 200
    except Exception:
        return _service_error("Failed to fetch employees")


def get_all_employees_grouped():
    try:
        employees = _fetch_all_employees()
        return _group_employees(employees), 200
    except Exception:
        return _service_error("Failed to fetch and group employees")


def get_employees_by_dept(dept_name):
    try:
        employees = list(
            employees_col.find(
                {"department": {"$regex": f"^{dept_name}$", "$options": "i"}},
                {"_id": 0}
            )
        )

        if not employees:
            return {"message": f"No employees found in department: {dept_name}"}, 404

        return employees, 200

    except Exception:
        return _service_error("Failed to fetch department employees")


def get_grouped_employees_with_attendance():
    try:
        today = datetime.now().strftime("%Y-%m-%d")

        employees = _fetch_all_employees()

        attendance_today = {
            rec.get("employee_id"): rec.get("status")
            for rec in attendance_col.find({"date": today})
        }

        enriched = []

        for emp in employees:
            emp_id = emp.get("employee_id")

            emp_copy = emp.copy()
            emp_copy["today_status"] = attendance_today.get(emp_id, "Pending")

            enriched.append(emp_copy)

        return _group_employees(enriched), 200

    except Exception:
        return _service_error("Failed to fetch grouped employees with attendance")


def delete_employee(emp_id):

    if not emp_id:
        return {"error": "Invalid employee id"}, 400

    try:
        result = employees_col.delete_one({"employee_id": emp_id})

        if result.deleted_count == 0:
            return {"error": "Employee not found"}, 404

        return {"message": "Employee deleted successfully"}, 200

    except Exception:
        return _service_error("Failed to delete employee")
