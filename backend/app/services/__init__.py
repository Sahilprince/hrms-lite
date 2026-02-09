# app/services/__init__.py
from .employee_service import create_employee, get_all_employees, delete_employee
from .attendance_service import mark_attendance, get_employee_attendance