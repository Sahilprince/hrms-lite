content = """HRMS Lite - Full-Stack Web Application
======================================

A lightweight, production-ready Human Resource Management System (HRMS Lite) that allows an admin to manage employees and track daily attendance with a clean UI and RESTful backend.

This project was built as a full-stack coding assignment with a focus on:
- Clean architecture
- Stable APIs
- Proper validation & error handling
- Realistic UI and UX
- Deployable setup

--------------------------------------------------------------------------------

FEATURES

1. Employee Management
   - Add new employee
   - View all employees (grouped by department)
   - View employee detail page
   - Delete employee (accessible from the employee detail page)

2. Attendance Management
   - Mark daily attendance (Present / Absent)
   - View attendance history per employee

3. Dashboard
   - Employees grouped by department
   - Today's attendance status per employee
   - Summary cards: Total employees, Attendance marked today, Present today, Absent today

4. Bonus Features
   - Filter attendance records by date
   - Display total present days per employee
   - Dashboard summary (counts + tables)

--------------------------------------------------------------------------------

TECH STACK

Frontend:
- React (Vite)
- TypeScript
- Axios
- React Router DOM
- CSS Modules

Backend:
- Python
- Flask
- PyMongo
- Pydantic
- Flask-CORS

Database:
- MongoDB Atlas

--------------------------------------------------------------------------------

PROJECT STRUCTURE

root
|
+-- backend/
|   +-- app/
|   |   +-- api/          # Route handlers
|   |   +-- services/     # Business logic
|   |   +-- database/     # DB connection & helper
|   |   +-- schema/       # Pydantic models
|   +-- run.py            # Entry point
|   +-- requirements.txt  # Python dependencies
|
+-- frontend/
    +-- src/
    |   +-- pages/
    |   +-- components/
    |   +-- services/     # API calls
    |   +-- styles/
    |   +-- types/        # TS Interfaces
    +-- package.json

--------------------------------------------------------------------------------

LIVE URLS

(Replace these with your actual deployed URLs)

Frontend:          https://hrms-lite-tau-dusky.vercel.app/
Backend API:       https://hrms-lite-2zwh.onrender.com/api
GitHub Repository: https://github.com/Sahilprince/hrms-lite.git

--------------------------------------------------------------------------------

HOW TO RUN LOCALLY

1. Backend Setup
   a. Move into the backend folder:
      cd backend

   b. Create a virtual environment:
      python -m venv venv

   c. Activate the environment:
      Windows:       venv\\Scripts\\activate
      Linux / macOS: source venv/bin/activate

   d. Install dependencies:
      pip install -r requirements.txt

   e. Create a .env file inside backend/ and add your MongoDB URI:
      MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/hrms_lite

   f. Run the backend:
      python run.py
      (Backend starts on http://localhost:5000)

2. Frontend Setup
   a. Move into the frontend folder:
      cd frontend

   b. Install dependencies:
      npm install

   c. Create a .env file inside frontend/ and add:
      VITE_API_BASE_URL=http://localhost:5000/api

   d. Run the frontend:
      npm run dev
      (Frontend starts on http://localhost:5173)

--------------------------------------------------------------------------------

BACKEND API OVERVIEW

Employee APIs:
- POST   /api/employees               (Create employee)
- GET    /api/employees               (List employees)
- GET    /api/employees/grouped       (Employees grouped by department)
- GET    /api/grouped                 (Grouped employees with today's attendance)
- DELETE /api/employees/{id}          (Delete employee)

Attendance APIs:
- POST   /api/attendance              (Mark attendance)
- GET    /api/attendance/employee/{id}(Employee attendance history)
- GET    /api/attendance/filter       (Filter attendance by date)
- GET    /api/attendance/present-summary (Total present days per employee)

Dashboard API:
- GET    /api/dashboard               (Dashboard summary counts)

--------------------------------------------------------------------------------

VALIDATIONS & ERROR HANDLING

- Required field validation using Pydantic
- Email format validation
- Duplicate employee prevention
- Attendance Rules:
  * Cannot mark future dates
  * Cannot mark before employee joining date
  * One record per employee per day
- Meaningful HTTP status codes & error messages

--------------------------------------------------------------------------------

ASSUMPTIONS & LIMITATIONS

1. Only one admin user (no authentication).
2. Leave management, payroll, and roles are out of scope.
3. Attendance data is retained even if an employee is deleted.
4. Time-zone handling is not implemented (local server time is used).

--------------------------------------------------------------------------------

AUTHOR
Sahil Sawana

This project is intended to demonstrate practical, production-ready full-stack development practices.
"""