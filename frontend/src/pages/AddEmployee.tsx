import React, { useState } from 'react';
import { createEmployee } from '../services/api';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Forms.module.css';

const AddEmployee: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    department: 'Engineering',
    joining_date: new Date().toISOString().split('T')[0] 
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createEmployee(formData);
      alert("Employee added successfully!");
      navigate('/'); // Go back to dashboard
    } catch (err: any) {
      const msg = err.response?.data?.error || "Failed to add employee";
      alert(msg);
    }
  };

  return (
    <div className="main-container">
      <div className={styles.formCard}>
        <h2>Register New Employee</h2>
        <form onSubmit={handleSubmit}>
          <label>Full Name</label>
          <input 
            type="text" required 
            value={formData.full_name}
            onChange={(e) => setFormData({...formData, full_name: e.target.value})}
          />

          <label>Email Address</label>
          <input 
            type="email" required 
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />

          <label>Department</label>
          <select 
            value={formData.department}
            onChange={(e) => setFormData({...formData, department: e.target.value})}
          >
            <option value="Engineering">Engineering</option>
            <option value="HR">HR</option>
            <option value="Finance">Finance</option>
            <option value="Marketing">Marketing</option>
          </select>

          <label>Joining Date</label>
          <input 
            type="date" required 
            value={formData.joining_date}
            onChange={(e) => setFormData({...formData, joining_date: e.target.value})}
          />

          <button type="submit" className={styles.submitBtn}>Add Employee</button>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;