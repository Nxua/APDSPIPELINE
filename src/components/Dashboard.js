import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = ({ loggedInUser, handleLogout }) => {
    const [recipientAccount, setRecipientAccount] = useState('');
    const [amount, setAmount] = useState('');
    const [currency, setCurrency] = useState('');
    const [provider, setProvider] = useState('');
    const [message, setMessage] = useState('');
    const [balance, setBalance] = useState(loggedInUser.balance);
    const [paymentHistory, setPaymentHistory] = useState([]);

    useEffect(() => {
        // Fetch payment history when the Dashboard loads
        const fetchPaymentHistory = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/payments/${loggedInUser.accountNumber}`);
                setPaymentHistory(response.data);
            } catch (error) {
                console.error('Failed to fetch payment history', error);
            }
        };

        fetchPaymentHistory();
    }, [loggedInUser.accountNumber]);

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const response = await axios.post('http://localhost:5000/api/payment', {
                payerAccount: loggedInUser.accountNumber,
                recipientAccount,
                amount,
                currency,
                provider
            });
    
            if (response.status === 200) {
                setMessage('Payment submitted for verification.');
                
                // Optionally, fetch updated payment history to reflect the pending transaction
                const updatedHistory = await axios.get(`http://localhost:5000/api/payments/${loggedInUser.accountNumber}`);
                setPaymentHistory(updatedHistory.data);
            }
        } catch (error) {
            setMessage(error.response?.data?.message || 'Payment submission failed. Please try again.');
        }
    };
    

    return (
        <div className="dashboard-container">
            <div className="dashboard-content">
                <h1 className="dashboard-title">Welcome, {loggedInUser?.fullName}!</h1>
                <p className="balance-text">Your current account balance: <strong>R{balance.toFixed(2)}</strong></p>
                <button onClick={handleLogout} className="logout-button">Logout</button>

                <hr className="divider" />

                <h2 className="payment-title">Make a Payment</h2>
                <form onSubmit={handlePaymentSubmit} className="payment-form">
                    <input
                        type="text"
                        placeholder="Recipient Account Number"
                        value={recipientAccount}
                        onChange={(e) => setRecipientAccount(e.target.value)}
                        required
                        className="input-field"
                    />
                    <input
                        type="number"
                        placeholder="Amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                        className="input-field"
                    />
                    <input
                        type="text"
                        placeholder="Currency (e.g., USD)"
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        required
                        className="input-field"
                    />
                    <select
                        value={provider}
                        onChange={(e) => setProvider(e.target.value)}
                        required
                        className="select-field"
                    >
                        <option value="" disabled>Select Provider</option>
                        <option value="SWIFT">SWIFT</option>
                    </select>
                    <button type="submit" className="payment-button">Submit Payment</button>
                </form>

                {message && <p className="success-message">{message}</p>}

                <hr className="divider" />

                <h2 className="payment-history-title">Payment History</h2>
                <table className="payment-history-table">
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Account Details</th>
                            <th>Amount</th>
                            <th>Currency</th>
                            <th>Provider</th>
                            <th>Timestamp</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paymentHistory.map((payment, index) => (
                            <tr key={index}>
                                <td>{payment.type}</td>
                                <td>
                                    {payment.type === 'Sent' ? `To: ${payment.recipientAccount}` : `From: ${payment.payerAccount}`}
                                </td>
                                <td>R{payment.amount.toFixed(2)}</td>
                                <td>{payment.currency}</td>
                                <td>{payment.provider}</td>
                                <td>{new Date(payment.timestamp).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Dashboard;