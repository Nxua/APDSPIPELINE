// Home.js
import React, { useState } from 'react';
import axios from 'axios';

const Home = ({ onLoginSuccess, onRegisterClick, onEmployeeLoginClick }) => {
    const [accountNumber, setAccountNumber] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5000/api/login', {
                accountNumber,
                password,
            });

            if (response.status === 200) {
                onLoginSuccess(response.data.customer);
            }
        } catch (error) {
            setMessage(
                error.response?.data?.message || 'Login failed. Please try again.'
            );
        }
    };

    return (
        <div className="home-container">
            <div className="home-content">
                <img src="/logo.png" alt="Nexaro Bank Logo" className="bank-logo" />
                <h1 className="bank-name">Nexaro Bank</h1>
                <p className="bank-slogan">Empowering Your Financial Future</p>

                <form onSubmit={handleSubmit} className="login-form">
                    <input
                        type="text"
                        placeholder="Account Number"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        required
                        className="input-field"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="input-field"
                    />
                    <button type="submit" className="login-button">
                        Login
                    </button>
                </form>

                {message && <p className="error-message">{message}</p>}

                <p className="register-text">
                    No account?{' '}
                    <span onClick={onRegisterClick} className="register-link">
                        Click to register
                    </span>
                </p>

                {/* New Employee Login Button */}
                <button onClick={onEmployeeLoginClick} className="employee-login-button">
                    Employee Login
                </button>
            </div>
        </div>
    );
};

export default Home;
