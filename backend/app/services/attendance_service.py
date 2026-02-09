from datetime import datetime

from app.database.mongo import attendance_col, employees_col
from app.schema.attendance import AttendanceSchema
from pydantic import ValidationError


def _service_error(message, status=500):
    return {"error": message}, status


def mark_attendance(data):
    try:
        validated_data = AttendanceSchema(**data)

        # 1. fetch employee
        employee = employees_col.find_one(
            {"employee_id": validated_data.employee_id},
            {"_id": 0, "joining_date": 1}
        )

        if not employee:
            return {"error": "Cannot mark attendance: Employee does not exist"}, 404

        joining_date_str = employee.get("joining_date")

        if not joining_date_str:
            return {"error": "Employee joining date not found"}, 500

        # 2. parse dates safely
        try:
            attendance_date = datetime.strptime(
                validated_data.date, "%Y-%m-%d"
            ).date()

            joining_date = datetime.strptime(
                joining_date_str, "%Y-%m-%d"
            ).date()
        except ValueError:
            return {"error": "Invalid joining date stored for employee"}, 500

        # 3. business rule
        if attendance_date < joining_date:
            return {
                "error": "Attendance date cannot be before employee joining date"
            }, 422

        # 4. prevent duplicate
        existing = attendance_col.find_one({
            "employee_id": validated_data.employee_id,
            "date": validated_data.date
        })

        if existing:
            return {"error": "Attendance already marked for this date"}, 409

        attendance_col.insert_one(validated_data.model_dump())

        return {"message": "Attendance marked successfully"}, 201

    except ValidationError as e:
        return {
            "error": e.errors(include_url=False, include_context=False)
        }, 422

    except Exception as e:
        # IMPORTANT: return real error during development
        return {"error": str(e)}, 500



def get_employee_attendance(emp_id):

    try:
        # 1. fetch employee (only what we need)
        employee = employees_col.find_one(
            {"employee_id": emp_id},
            {"_id": 0, "employee_id": 1, "full_name": 1}
        )

        if not employee:
            return {"error": "Employee not found"}, 404

        # 2. fetch attendance
        records = list(
            attendance_col.find(
                {"employee_id": emp_id},
                {"_id": 0}
            )
        )

        return {
            "employee_id": employee["employee_id"],
            "full_name": employee.get("full_name"),
            "attendance": records
        }, 200

    except Exception:
        return _service_error("Failed to fetch employee attendance")
    
def filter_attendance_by_date(from_date=None, to_date=None):
    try:
        query = {}

        if from_date and to_date:
            # validate format
            datetime.strptime(from_date, "%Y-%m-%d")
            datetime.strptime(to_date, "%Y-%m-%d")

            query["date"] = {
                "$gte": from_date,
                "$lte": to_date
            }

        records = list(
            attendance_col.find(query, {"_id": 0})
        )

        return records, 200

    except ValueError:
        return {"error": "Invalid date format. Use YYYY-MM-DD"}, 422
    except Exception:
        return {"error": "Failed to filter attendance"}, 500


def get_present_days_per_employee():
    try:
        pipeline = [
            {"$match": {"status": "Present"}},
            {
                "$group": {
                    "_id": "$employee_id",
                    "total_present_days": {"$sum": 1}
                }
            },
            {"$sort": {"total_present_days": -1}}
        ]

        data = list(attendance_col.aggregate(pipeline))

        result = []

        for row in data:
            emp = employees_col.find_one(
                {"employee_id": row["_id"]},
                {"_id": 0, "full_name": 1}
            )
            if not emp:
                continue

            result.append({
                "employee_id": row["_id"],
                "full_name": emp.get("full_name"),
                "total_present_days": row["total_present_days"]
            })

        return result, 200

    except Exception:
        return {"error": "Failed to calculate present days"}, 500
