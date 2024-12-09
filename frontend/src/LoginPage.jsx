import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css'; 

const LoginPage = ({ onLogin }) => { // Accept onLogin as a prop
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        passwordConfirmation: '',
    });
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
        setErrorMessage(''); // Reset error message on input change
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(''); // Reset error message on submit

        try {
            if (isLogin) {
                // Login Logic
                const response = await fetch('http://localhost:5000/api/users/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: formData.username,
                        password: formData.password,
                    }),
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(`Login failed: ${error.message}`);
                }

                const data = await response.json();
                console.log('Logged in:', data);
                onLogin(); // Call onLogin to update authentication state
                navigate('/staff-management'); // Redirect to Staff Management after successful login
            } else {
                // Signup Logic
                if (formData.password !== formData.passwordConfirmation) {
                    throw new Error("Passwords do not match!");
                }

                const response = await fetch('http://localhost:5000/api/users/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: formData.username,
                        password: formData.password,
                        email: formData.email,
                    }),
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(`Signup failed: ${error.message}`);
                }

                const data = await response.json();
                console.log('Registered:', data);
                setIsLogin(true); // Switch to login mode
                setFormData({
                    username: '',
                    email: '',
                    password: '',
                    passwordConfirmation: '',
                });
            }
        } catch (error) {
            console.error("Error occurred:", error);
            setErrorMessage(error.message || "An unexpected error occurred.");
        }
    };

    return (
        <div className="login-container">
            <h1>Welcome to AWY</h1>
            <p>Human Resource Management</p>
            <form onSubmit={handleSubmit}>
                {errorMessage && <div className="error-message" aria-live="assertive">{errorMessage}</div>}
                {!isLogin && (
                    <>
                        <div>
                            <label htmlFor="username">Username:</label>
                            <input
                                type="text"
                                name="username"
                                id="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="email">Email:</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password">Password:</label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="passwordConfirmation">Confirm Password:</label>
                            <input
                                type="password"
                                name="passwordConfirmation"
                                id="passwordConfirmation"
                                value={formData.passwordConfirmation}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </>
                )}
                {isLogin && (
                    <>
                        <div>
                            <label htmlFor="username">Username:</label>
                            <input
                                type="text"
                                name="username"
                                id="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password">Password:</label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </>
                )}
                <button type="submit">{isLogin ? 'Login' : 'Create Account'}</button>
            </form>
            <button onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? 'Create an Account' : 'Already have an Account? Login'}
            </button>
        </div>
    );
};

export default LoginPage;