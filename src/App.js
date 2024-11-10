import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Home from './components/Home';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import EmployeeDashboard from './components/EmployeeDashboard';
import EmployeeLogin from './components/EmployeeLogin';
import './components/Home.css';

function App() {
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [loggedInEmployee, setLoggedInEmployee] = useState(null);
    const navigate = useNavigate();

    const handleLoginSuccess = (customer) => {
        setLoggedInUser(customer);
        setLoggedInEmployee(null);
        navigate('/dashboard');
    };

    const handleEmployeeLoginSuccess = (employee) => {
        setLoggedInEmployee(employee);
        setLoggedInUser(null);
        navigate('/employee-dashboard');
    };

    const handleRegisterClick = () => {
        navigate('/register');
    };

    const handleEmployeeLoginClick = () => {
        navigate('/employeelogin');
    };

    const handleBackToHomeClick = () => {
        navigate('/');
    };

    const handleLogout = () => {
        setLoggedInUser(null);
        setLoggedInEmployee(null);
        navigate('/');
    };

    return (
        <Routes>
            <Route
                path="/"
                element={
                    <Home
                        onLoginSuccess={handleLoginSuccess}
                        onRegisterClick={handleRegisterClick}
                        onEmployeeLoginClick={handleEmployeeLoginClick}
                    />
                }
            />
            <Route path="/register" element={<Register onBackToHomeClick={handleBackToHomeClick} />} />
            <Route
                path="/dashboard"
                element={
                    loggedInUser ? (
                        <Dashboard loggedInUser={loggedInUser} handleLogout={handleLogout} />
                    ) : (
                        <Navigate to="/" />
                    )
                }
            />
            <Route
                path="/employeelogin"
                element={<EmployeeLogin onLoginSuccess={handleEmployeeLoginSuccess} />}
            />
            <Route
                path="/employee-dashboard"
                element={
                    loggedInEmployee ? (
                        <EmployeeDashboard loggedInEmployee={loggedInEmployee} handleLogout={handleLogout} />
                    ) : (
                        <Navigate to="/" />
                    )
                }
            />
        </Routes>
    );
}

export default function AppWrapper() {
    return (
        <Router>
            <App />
        </Router>
    );
}
