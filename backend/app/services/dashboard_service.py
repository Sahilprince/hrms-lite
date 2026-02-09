from datetime import datetime
from app.database.mongo import employees_col, attendance_col


def get_dashboard_summary():
    try:
        today = datetime.now().strftime("%Y-%m-%d")

        total_employees = employees_col.count_documents({})

        total_attendance_today = attendance_col.count_documents({
            "date": today
        })

        present_today = attendance_col.count_documents({
            "date": today,
            "status": "Present"
        })

        absent_today = attendance_col.count_documents({
            "date": today,
            "status": "Absent"
        })

        return {
            "total_employees": total_employees,
            "attendance_marked_today": total_attendance_today,
            "present_today": present_today,
            "absent_today": absent_today
        }, 200

    except Exception:
        return {"error": "Failed to load dashboard summary"}, 500
