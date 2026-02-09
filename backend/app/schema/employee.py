from pydantic import BaseModel, EmailStr, Field, field_validator
from datetime import datetime
from typing import Optional
import re

class EmployeeSchema(BaseModel):
    # Required from Admin
    full_name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    department: str = Field(..., min_length=1)
    joining_date: str = Field(..., description="Date the employee joined (YYYY-MM-DD)")
    
    # System Generated (from id funtion)
    employee_id: Optional[str] = None 

    @field_validator('joining_date')
    @classmethod
    def validate_joining_date(cls, v: str) -> str:
        try:
            input_date = datetime.strptime(v, "%Y-%m-%d").date()
            if input_date > datetime.now().date():
                raise ValueError("Joining date cannot be in the future")
        except ValueError as e:
            if "future" in str(e):
                raise e
            raise ValueError("Joining date must be in YYYY-MM-DD format")
        return v

    @field_validator('full_name')
    @classmethod
    def name_must_contain_space(cls, v: str) -> str:
        if ' ' not in v.strip():
            raise ValueError('Full name must include at least a first and last name')
        return v.title()