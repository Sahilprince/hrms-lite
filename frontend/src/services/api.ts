import axios, { AxiosResponse } from 'axios';
import { Employee, GroupedEmployees, AttendanceRecord } from '../types';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});


// Only grouped employees (no attendance)
export const getEmployeesGroupedByDepartment = (): Promise<AxiosResponse<GroupedEmployees>> =>
    api.get<GroupedEmployees>('/employees/grouped');

// Grouped employees + today_status
export const getGroupedEmployeesWithAttendance =
    (): Promise<AxiosResponse<GroupedEmployees>> =>
        api.get<GroupedEmployees>('/grouped');

// Create employee
export const createEmployee =
    (data: Partial<Employee>): Promise<AxiosResponse<Employee>> =>
        api.post<Employee>('/employees', data);

// Delete employee
export const deleteEmployee =
    (empId: string): Promise<AxiosResponse<{ message: string }>> =>
        api.delete(`/employees/${empId}`);

// (only if you later add this endpoint in backend)
export const getEmployeeById =
    (empId: string): Promise<AxiosResponse<Employee>> =>
        api.get<Employee>(`/employees/${empId}`);


export const markAttendance =
    (data: AttendanceRecord): Promise<AxiosResponse<{ message: string }>> =>
        api.post('/attendance', data);

export const getEmployeeAttendance =
    (empId: string): Promise<AxiosResponse<AttendanceRecord[]>> =>
        api.get<AttendanceRecord[]>(`/attendance/employee/${empId}`);

// filter attendance by date
export const filterAttendanceByDate = (
    from: string,
    to: string
) =>
    api.get('/attendance/filter', {
        params: { from, to }
    });


// present days per employee
export const getPresentDaysSummary = () =>
    api.get('/attendance/present-summary');


// dashboard summary
export const getDashboardSummary = () =>
    api.get('/dashboard');

export default api;
