import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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
        <div>
        
            {isAuthenticated && <NavBar onLogout={handleLogout} />}
            <Routes>
                <Route path="/" element={<LoginPage onLogin={handleLogin} />} /> 
                <Route path="/staff-management" element={<StaffManagement />} />
                <Route path="/procurement-management" element={<ProcurementManagement />} /> 
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