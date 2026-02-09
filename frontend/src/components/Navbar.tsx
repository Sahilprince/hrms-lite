import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Navbar.module.css';

const Navbar: React.FC = () => {
  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>HRMS Lite</div>
      <div className={styles.links}>
        <Link to="/">Dashboard</Link>
        <Link to="/add-employee">Add Employee</Link>
        <Link to="/attendance">Mark Attendance</Link>
      </div>
    </nav>
  );
};

export default Navbar;