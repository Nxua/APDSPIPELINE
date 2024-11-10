import React, { useState } from 'react';
import axios from 'axios';
import './Register.css';

const Register = ({ onBackToHomeClick }) => {
    const [fullName, setFullName] = useState('');
    const [idNumber, setIdNumber] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [idNumberError, setIdNumberError] = useState('');
    const [accountNumberError, setAccountNumberError] = useState('');

    const validatePassword = (password) => {
        const minLength = 8; // Minimum length for password
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const errors = [];

        if (password.length < minLength) {
            errors.push('Password must be at least 8 characters long.');
        }
        if (!hasUpperCase) {
            errors.push('Password must contain at least one uppercase letter.');
        }
        if (!hasLowerCase) {
            errors.push('Password must contain at least one lowercase letter.');
        }
        if (!hasNumbers) {
            errors.push('Password must contain at least one number.');
        }
        if (!hasSpecialChars) {
            errors.push('Password must contain at least one special character.');
        }
        
        return errors; // Return an array of errors
    };

    const validateIdNumber = (id) => {
        const isValid = /^\d{13}$/.test(id); // Check if it's exactly 13 digits
        return isValid ? '' : 'ID Number must be exactly 13 digits long and contain only numbers.';
    };

    const validateAccountNumber = (account) => {
        const isValid = /^\d{6}$/.test(account); // Check if it's exactly 6 digits
        return isValid ? '' : 'Account Number must be exactly 6 digits long.';
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        const passwordValidationErrors = validatePassword(password);
        const idNumberValidationError = validateIdNumber(idNumber);
        const accountNumberValidationError = validateAccountNumber(accountNumber);
        
        if (passwordValidationErrors.length > 0) {
            setPasswordError(passwordValidationErrors.join(' '));
            return; // Stop registration if password is invalid
        } else {
            setPasswordError(''); // Clear any previous error
        }

        if (idNumberValidationError) {
            setIdNumberError(idNumberValidationError);
            return; // Stop registration if ID Number is invalid
        } else {
            setIdNumberError(''); // Clear any previous error
        }

        if (accountNumberValidationError) {
            setAccountNumberError(accountNumberValidationError);
            return; // Stop registration if Account Number is invalid
        } else {
            setAccountNumberError(''); // Clear any previous error
        }

        try {
            const response = await axios.post('http://localhost:5000/api/register', {
                fullName,
                idNumber,
                accountNumber,
                password,
            });

            if (response.status === 201) {
                setMessage('Registration successful! Please log in.');
            }
        } catch (error) {
            // Check if error response includes validation errors
            if (error.response?.data?.errors) {
                setMessage(error.response.data.errors.join(' '));
            } else {
                setMessage(error.response?.data?.message || 'Registration failed. Please try again.');
            }
        }
    };

    return (
        <div className="register-container">
            <div className="register-content">
                <h1 className="register-title">Create Your Account</h1>
                <form onSubmit={handleRegister} className="register-form">
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className="input-field"
                        name="fullName"
                        id="fullName"
                    />
                    <input
                        type="text"
                        placeholder="ID Number"
                        value={idNumber}
                        onChange={(e) => setIdNumber(e.target.value)}
                        required
                        className="input-field"
                        name="idNumber"
                        id="idNumber"
                        autoComplete="off"
                    />
                    {idNumberError && <p className="error-message">{idNumberError}</p>}
                    <input
                        type="text"
                        placeholder="Account Number"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        required
                        className="input-field"
                        name="username"
                        id="username"
                        autoComplete="username"
                    />
                    {accountNumberError && <p className="error-message">{accountNumberError}</p>}
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="input-field"
                        name="password"
                        id="password"
                        autoComplete="new-password"
                    />
                    {passwordError && <p className="error-message">{passwordError}</p>}
                    <button type="submit" className="register-button">Register</button>
                </form>
                {message && <p className="success-message">{message}</p>}
                <p className="back-home-text">
                    Already have an account?{' '}
                    <span onClick={onBackToHomeClick} className="back-home-link">Back to Home</span>
                </p>
            </div>
        </div>
    );
};

export default Register;
