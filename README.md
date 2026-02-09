# HRMS Lite – Full-Stack Web Application

A lightweight, production-ready **Human Resource Management System (HRMS Lite)** that allows an admin to manage employees and track daily attendance with a clean UI and RESTful backend.

This project was built as a full-stack coding assignment with a focus on:
- Clean architecture
- Stable APIs
- Proper validation & error handling
- Realistic UI and UX
- Deployable setup

---

## ✨ Features

### 👤 Employee Management
- **Add new employee**
- **View all employees** (grouped by department)
- **View employee detail page**
- **Delete employee** (accessible from the employee detail page)

### 🕒 Attendance Management
- **Mark daily attendance** (Present / Absent)
- **View attendance history** per employee

### 📊 Dashboard
- Employees grouped by department
- Today’s attendance status per employee
- **Summary cards:**
  - Total employees
  - Attendance marked today
  - Present today
  - Absent today

### ⭐ Bonus Features
- Filter attendance records by date
- Display total present days per employee
- Dashboard summary (counts + tables)

---

## 🧱 Tech Stack

| Category | Technologies |
| :--- | :--- |
| **Frontend** | React (Vite), TypeScript, Axios, React Router DOM, CSS Modules |
| **Backend** | Python, Flask, PyMongo, Pydantic, Flask-CORS |
| **Database** | MongoDB Atlas |

---

## 📁 Project Structure

root
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── services/
│   │   ├── database/
│   │   └── schema/
│   ├── run.py
│   └── requirements.txt
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   ├── components/
    │   ├── services/
    │   ├── styles/
    │   └── types/
    └── package.json
---

## 🔗 Live URLs

> *Replace the links below with your deployed URLs*

- **Frontend:** [https://hrms-lite-tau-dusky.vercel.app/](https://hrms-lite-tau-dusky.vercel.app/)
- **Backend API:** [https://hrms-lite-2zwh.onrender.com/api](https://hrms-lite-2zwh.onrender.com/api)
- **GitHub Repository:** [https://github.com/Sahilprince/hrms-lite-git](https://github.com/Sahilprince/hrms-lite-git)

---

## 🚀 How to Run Locally

### 1️⃣ Backend Setup

1. **Move into the backend folder:**
   ```
   cd backend
   ```

2. **Create a virtual environment:**
   ```
   python -m venv venv
   ```

3. **Activate the environment:**
   - **Windows:** `venv\Scripts\\activate`
   - **Linux / macOS:** `source venv/bin/activate`

4. **Install dependencies:**
   ```
   pip install -r requirements.txt
   ```

5. **Configure Environment:**
   Create a `.env` file inside `backend/` and add your MongoDB connection string:
   ```
   MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/hrms_lite
   ```

6. **Run the backend:**
   ```
   python run.py
   ```
   *The backend will start on `http://localhost:5000`*

### 2️⃣ Frontend Setup

1. **Move into the frontend folder:**
   ```
   cd frontend
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Configure Environment:**
   Create a `.env` file inside `frontend/` and point to your local backend:
   ```
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

4. **Run the frontend:**
   ```
   npm run dev
   ```
   *The frontend will start on `http://localhost:5173`*

---

## 🧩 Backend API Overview

### Employee APIs
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/employees` | Create employee |
| `GET` | `/api/employees` | List employees |
| `GET` | `/api/employees/grouped` | Employees grouped by department |
| `GET` | `/api/grouped` | Grouped employees with today’s attendance |
| `DELETE` | `/api/employees/{{id}}` | Delete employee |

### Attendance APIs
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/attendance` | Mark attendance |
| `GET` | `/api/attendance/employee/{{id}}` | Employee attendance history |
| `GET` | `/api/attendance/filter` | Filter attendance by date |
| `GET` | `/api/attendance/present-summary` | Total present days per employee |

### Dashboard API
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/dashboard` | Dashboard summary counts |

---

## ✅ Validations & Error Handling
- Required field validation using Pydantic
- Email format validation
- Duplicate employee prevention
- **Attendance Rules:**
  - Cannot mark future dates
  - Cannot mark before employee joining date
  - One record per employee per day
- Meaningful HTTP status codes & error messages

---

## 🧑‍💻 UI & UX Highlights
- Clean and professional layout
- Consistent typography and spacing
- **Meaningful UI states:** Loading, Empty states, Error states
- Delete confirmation for destructive actions

---

## 📝 Assumptions & Limitations
1. Only one admin user (no authentication).
2. Leave management, payroll, and roles are out of scope.
3. Attendance data is retained even if an employee is deleted.
4. Time-zone handling is not implemented (local server time is used).

---

## 👨‍💻 Author
**Sahil Sawana**

This project is intended to demonstrate practical, production-ready full-stack development practices.
