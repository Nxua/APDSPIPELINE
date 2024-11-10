import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ setLoggedInUser }) => {
    const [accountNumber, setAccountNumber] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5000/api/login', {
                accountNumber,
                password
            });

            if (response.status === 200) {
                // Save the logged-in user information
                const user = {
                    accountNumber,
                    customerId: response.data.customerId,
                    fullName: response.data.fullName,
                    balance: response.data.balance
                };

                localStorage.setItem('loggedInUser', JSON.stringify(user));
                
                // Set the logged-in user state in App
                setLoggedInUser(user);

                setMessage(response.data.message); // Success message
            }
        } catch (error) {
            setMessage(error.response?.data?.message || 'An error occurred');
        }
    };

    return (
        <div>
            <h2>Customer Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Account Number"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    required
                />
                <br />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <br />
                <button type="submit">Login</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Login;
