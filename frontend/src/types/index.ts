export interface Employee {
  employee_id: string;
  full_name: string;
  email: string;
  department: string;
  joining_date: string;
  today_status?: string;
}

export interface GroupedEmployees {
  [department: string]: Employee[];
}

export interface AttendanceRecord {
  employee_id: string;
  date: string; // YYYY-MM-DD
  status: "Present" | "Absent" | "On Leave";
}