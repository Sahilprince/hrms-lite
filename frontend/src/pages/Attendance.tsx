import React, { useState } from 'react';
import { markAttendance } from '../services/api';
import styles from '../styles/Forms.module.css';

const Attendance: React.FC = () => {
  const [log, setLog] = useState({
    employee_id: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Present'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await markAttendance(log as any);
      alert("Attendance logged!");
      setLog({ ...log, employee_id: '' }); 
    } catch (err: any) {
      alert(err.response?.data?.error || "Error logging attendance");
    }
  };

  return (
    <div className="main-container">
      <div className={styles.formCard}>
        <h2>Daily Attendance Logger</h2>
        <form onSubmit={handleSubmit}>
          <label>Employee ID (e.g., EMP-1001)</label>
          <input 
            type="text" placeholder="EMP-XXXX" required 
            value={log.employee_id}
            onChange={(e) => setLog({...log, employee_id: e.target.value})}
          />

          <label>Date</label>
          <input 
            type="date" required 
            value={log.date}
            onChange={(e) => setLog({...log, date: e.target.value})}
          />

          <label>Status</label>
          <select 
            value={log.status}
            onChange={(e) => setLog({...log, status: e.target.value as 'Present' | 'Absent'})}
          >
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
          </select>

          <button type="submit" className={styles.submitBtn}>Log Status</button>
        </form>
      </div>
    </div>
  );
};

export default Attendance;