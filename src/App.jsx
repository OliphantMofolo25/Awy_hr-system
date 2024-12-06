import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import NavBar from './NavBar'; 
import StaffManagement from './StaffManagement';
import ProcurementManagement from './ProcurementManagement';
import LoginPage from './LoginPage'; 
import './App.css'; 

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false); 

    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        setIsAuthenticated(false); 
    };

    return (
        <div style={{ backgroundImage: `url(/images/Background.jpg)`, backgroundSize: 'cover', minHeight: '100vh' }}>
            {isAuthenticated && <NavBar onLogout={handleLogout} />}
            <Routes>
                <Route path="/" element={<LoginPage onLogin={handleLogin} />} /> 
                <Route path="/staff-management" element={isAuthenticated ? <StaffManagement /> : <Navigate to="/" />} />
                <Route path="/procurement-management" element={isAuthenticated ? <ProcurementManagement /> : <Navigate to="/" />} />
                {/* Fallback route */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </div>
    );
};

const Main = () => (
    <Router>
        <App />
    </Router>
);

export default Main;