import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    getGroupedEmployeesWithAttendance,
    getDashboardSummary,
    filterAttendanceByDate,
    getPresentDaysSummary
} from '../services/api';
import { GroupedEmployees } from '../types';
import styles from '../styles/Dashboard.module.css';

type DashboardSummary = {
    total_employees: number;
    attendance_marked_today: number;
    present_today: number;
    absent_today: number;
};

type AttendanceRow = {
    employee_id: string;
    date: string;
    status: string;
};

type PresentSummaryRow = {
    employee_id: string;
    full_name: string | null;
    total_present_days: number;
};

const Dashboard: React.FC = () => {

    const [data, setData] = useState<GroupedEmployees>({});
    const [summary, setSummary] = useState<DashboardSummary | null>(null);

    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [filtered, setFiltered] = useState<AttendanceRow[]>([]);
    const [filterLoading, setFilterLoading] = useState(false);

    // present summary
    const [presentSummary, setPresentSummary] = useState<PresentSummaryRow[]>([]);
    const [presentLoading, setPresentLoading] = useState(false);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filterError, setFilterError] = useState<string | null>(null);
    const [presentError, setPresentError] = useState<string | null>(null);


    useEffect(() => {
        let mounted = true;

        const load = async () => {
            try {
                setLoading(true);
                setPresentLoading(true);
                setPresentError(null);

                const [empRes, summaryRes, presentRes] = await Promise.all([
                    getGroupedEmployeesWithAttendance(),
                    getDashboardSummary(),
                    getPresentDaysSummary()
                ]);

                if (!mounted) return;

                setData(empRes.data);
                setSummary(summaryRes.data);
                setPresentSummary(presentRes.data);

            } catch (err) {

                if (!mounted) return;

                setError('Failed to load dashboard');
                setPresentError('Failed to load present days summary');

            } finally {

                if (!mounted) return;

                setLoading(false);
                setPresentLoading(false);
            }
        };

        load();

        return () => { mounted = false; };

    }, []);


    const handleFilter = async () => {

        if (!from || !to) {
            setFilterError("Please select both dates");
            return;
        }

        try {
            setFilterLoading(true);
            setFilterError(null);

            const res = await filterAttendanceByDate(from, to);
            setFiltered(res.data);

        } catch (err: any) {
            setFilterError(
                err.response?.data?.error || "Failed to fetch attendance records"
            );
            setFiltered([]);
        } finally {
            setFilterLoading(false);
        }
    };

    if (loading) return <div className="main-container">Loading...</div>;
    if (error) return <div className="main-container">{error}</div>;

    return (
        <div className="main-container">

            {summary && (
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: 16,
                        marginBottom: 32
                    }}
                >
                    <div className={styles.statCard}>
                        <h4>Total Employees</h4>
                        <p>{summary.total_employees}</p>
                    </div>

                    <div className={styles.statCard}>
                        <h4>Attendance Marked Today</h4>
                        <p>{summary.attendance_marked_today}</p>
                    </div>

                    <div className={styles.statCard}>
                        <h4>Present Today</h4>
                        <p>{summary.present_today}</p>
                    </div>

                    <div className={styles.statCard}>
                        <h4>Absent Today</h4>
                        <p>{summary.absent_today}</p>
                    </div>
                </div>
            )}
            <section className={styles.deptSection}>
                <h2 className={styles.deptTitle}>
                    Attendance Records (By Date)
                </h2>

                <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                    <div>
                        <label>From</label>
                        <input
                            type="date"
                            value={from}
                            onChange={e => setFrom(e.target.value)}
                        />
                    </div>

                    <div>
                        <label>To</label>
                        <input
                            type="date"
                            value={to}
                            onChange={e => setTo(e.target.value)}
                        />
                    </div>

                    <div style={{ alignSelf: 'flex-end' }}>
                        <button onClick={handleFilter}>
                            Filter
                        </button>
                    </div>
                </div>

                {filterLoading && <p>Loading attendance records...</p>}
                {filterError && (
                    <p style={{ color: 'crimson' }}>{filterError}</p>
                )}
                {!filterLoading && !filterError && filtered.length === 0 && from && to && (
                    <p>No attendance records found for selected dates.</p>
                )}

                {!filterLoading && !filterError && filtered.length > 0 && (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Employee ID</th>
                                <th>Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((row, i) => (
                                <tr key={i}>
                                    <td>{row.employee_id}</td>
                                    <td>{row.date}</td>
                                    <td>{row.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </section>
            <section className={styles.deptSection}>
                <h2 className={styles.deptTitle}>
                    Total Present Days per Employee
                </h2>

                {presentLoading && <p>Loading present days summary...</p>}


                {presentError && (
                    <p style={{ color: 'crimson' }}>{presentError}</p>
                )}

                {!presentLoading && !presentError && presentSummary.length === 0 && (
                    <p>No attendance data available yet.</p>
                )}

                {!presentLoading && !presentError && presentSummary.length > 0 && (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Employee ID</th>
                                <th>Name</th>
                                <th>Present Days</th>
                            </tr>
                        </thead>
                        <tbody>
                            {presentSummary.map(row => (
                                <tr key={row.employee_id}>
                                    <td>
                                        <Link
                                            to={`/employee/${row.employee_id}`}
                                            className={styles.empLink}
                                        >
                                            {row.employee_id}
                                        </Link>
                                    </td>
                                    <td>
                                        <Link
                                            to={`/employee/${row.employee_id}`}
                                            className={styles.empLink}
                                        >
                                            {row.full_name || '-'}
                                        </Link>
                                    </td>
                                    <td>{row.total_present_days}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </section>
            <h1>Employee Directory</h1>

            {Object.entries(data).map(([dept, employees]) => (
                <section key={dept} className={styles.deptSection}>
                    <Link to={`/department/${dept}`} className={styles.deptLink}>
                        <h2 className={styles.deptTitle}>
                            {dept} Department <span>(View Full Roster)</span>
                        </h2>
                    </Link>

                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Emp ID</th>
                                <th>Full Name</th>
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
                                    <td>
                                        <Link
                                            to={`/employee/${emp.employee_id}`}
                                            className={styles.empLink}
                                        >
                                            {emp.full_name}
                                        </Link>
                                    </td>
                                    <td>
                                        <span>
                                            {emp.today_status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            ))}
        </div>
    );
};

export default Dashboard;
