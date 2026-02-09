import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api, { deleteEmployee } from '../services/api';
import styles from '../styles/Dashboard.module.css';

type AttendanceRecord = {
  date: string;
  status: 'Present' | 'Absent';
};

type AttendanceResponse = {
  employee_id: string;
  full_name: string;
  attendance: AttendanceRecord[];
};

const EmployeeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [employeeName, setEmployeeName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    let mounted = true;

    const loadAttendance = async () => {
      try {
        const res = await api.get<AttendanceResponse>(
          `/attendance/employee/${id}`
        );

        if (!mounted) return;

        setAttendance(res.data.attendance);
        setEmployeeName(res.data.full_name);
      } catch (err) {
        if (!mounted) return;
        setError('Failed to load attendance');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadAttendance();

    return () => {
      mounted = false;
    };
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete employee ${id}?`
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      setDeleteError(null);

      await deleteEmployee(id);

      navigate('/');

    } catch (err: any) {
      setDeleteError(
        err.response?.data?.error || 'Failed to delete employee'
      );
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <div className="main-container">Loading...</div>;
  if (error) return <div className="main-container">{error}</div>;

  return (
    <div className="main-container">
      <div className={styles.detailHeader}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>{employeeName || id}</h1>
            <p>Employee ID: {id}</p>
          </div>

          <button
            onClick={handleDelete}
            disabled={deleting}
            style={{
              background: '#ef4444',
              color: 'white'
            }}
          >
            {deleting ? 'Deleting...' : 'Delete Employee'}
          </button>
        </div>

        {deleteError && (
          <p style={{ color: 'crimson', marginTop: 8 }}>
            {deleteError}
          </p>
        )}
      </div>

      {attendance.length === 0 ? (
        <p>No attendance records available.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((record, index) => (
              <tr key={index}>
                <td>{record.date}</td>
                <td>{record.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EmployeeDetail;
