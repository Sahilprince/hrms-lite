import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import AddEmployee from './pages/AddEmployee';
import Attendance from './pages/Attendance';
import EmployeeDetail from './pages/EmployeeDetail';
import DepartmentView from './pages/DepartmentView';
import './styles/Global.css';

function App() {
    return (
        <Router>
            <Navbar />
            <div className="content-area">
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/add-employee" element={<AddEmployee />} />
                    <Route path="/attendance" element={<Attendance />} />
                    <Route path="/employee/:id" element={<EmployeeDetail/>} />
                    <Route path="/department/:name" element={<DepartmentView />} />
                    <Route path="*" element={
                        <div className="main-container">
                            <h2>404: Page Not Found</h2>
                            <p>The page you are looking for doesn't exist.</p>
                        </div>
                    } />
                </Routes>
            </div>
        </Router>
    );
}

export default App;