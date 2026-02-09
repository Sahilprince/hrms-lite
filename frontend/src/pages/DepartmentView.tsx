import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getGroupedEmployeesWithAttendance } from '../services/api';
import { Employee } from '../types';
import styles from '../styles/Dashboard.module.css';

const DepartmentView: React.FC = () => {
  const { name } = useParams<{ name: string }>();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // decode in case department has spaces like "Human Resources"
  const departmentName = name ? decodeURIComponent(name) : '';

  useEffect(() => {
    if (!departmentName) return;

    let mounted = true;

    const load = async () => {
      try {
        const res = await getGroupedEmployeesWithAttendance();

        if (!mounted) return;

        const grouped = res.data;

        setEmployees(grouped[departmentName] || []);
      } catch (err) {
        if (!mounted) return;
        setError('Failed to load department roster');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [departmentName]);

  if (loading) return <div className="loader">Loading Roster...</div>;
  if (error) return <div className="main-container">{error}</div>;

  return (
    <div className="main-container">
      <div className={styles.headerRow}>
        <Link to="/" className={styles.backBtn}>
          ← Back to Dashboard
        </Link>
        <h1>{departmentName} Department Roster</h1>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Emp ID</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Joined</th>
            <th>Status (Today)</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => (
            <tr key={emp.employee_id}>
              <td className={styles.idCell}>
                <Link to={`/employee/${emp.employee_id}`}>
                  {emp.employee_id}
                </Link>
              </td>
              <td>{emp.full_name}</td>
              <td>{emp.email}</td>
              <td>{emp.joining_date}</td>
              <td>
                <span
                  className={
                    emp.today_status === 'Present'
                      ? styles.badgePresent
                      : emp.today_status === 'Absent'
                      ? styles.badgeAbsent
                      : styles.statusBadgePending
                  }
                >
                  {emp.today_status || 'Pending'}
                </span>
              </td>
            </tr>
          ))}

          {employees.length === 0 && (
            <tr>
              <td colSpan={5} style={{ textAlign: 'center' }}>
                No employees found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DepartmentView;
