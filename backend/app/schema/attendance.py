from pydantic import BaseModel, Field, field_validator
from datetime import datetime
from typing import Literal

class AttendanceSchema(BaseModel):
    # Link to the Employee using system generated employee_id
    employee_id: str = Field(..., description="The auto-generated ID of the employee")
    
    date: str = Field(..., description="Date of attendance")
    
    status: Literal["Present", "Absent"]

    # Validates that the date is in YYYY-MM-DD format and not in the future.
    @field_validator('date')
    @classmethod
    def validate_date_format(cls, v: str) -> str:
        try:
            input_date = datetime.strptime(v, "%Y-%m-%d").date()
            
            # cannot mark attendance for future days
            if input_date > datetime.now().date():
                raise ValueError("Attendance date cannot be in the future")
        except ValueError as e:
            if "future" in str(e):
                raise e
            raise ValueError("Date must be in YYYY-MM-DD format")
        return v