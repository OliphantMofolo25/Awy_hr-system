import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NavBar.css';

const NavBar = ({ onLogout }) => {
    const navigate = useNavigate();

    const handleSignOut = () => {
        onLogout(); 
        navigate('/'); 
    };

    return (
        <div className="navbar">
            <div className="navbar-left">
                <h1>AWY MANAGEMENT</h1>
            </div>
            <div className="navbar-center">
                <button onClick={() => navigate('/staff-management')}>Staff Management</button>
                <button onClick={() => navigate('/procurement-management')}>Procurement Management</button>
            </div>
            <div className="navbar-right">
                <button onClick={handleSignOut}>Sign Out</button>
            </div>
        </div>
    );
};

export default NavBar;