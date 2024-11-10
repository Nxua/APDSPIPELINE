// EmployeeDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './EmployeeDashboard.css';

const EmployeeDashboard = () => {
    const [transactions, setTransactions] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Fetch unverified transactions
        const fetchTransactions = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/employees/transactions');
                setTransactions(response.data);
            } catch (error) {
                setMessage('Error loading transactions.');
            }
        };
        fetchTransactions();
    }, []);

    // Handle verify transaction
    const handleVerify = async (transactionId) => {
        try {
            await axios.put(`http://localhost:5000/api/employees/transactions/${transactionId}/verify`);
            setTransactions(transactions.filter((transaction) => transaction._id !== transactionId));
            setMessage('Transaction verified.');
        } catch (error) {
            setMessage('Error verifying transaction.');
        }
    };

    return (
        <div className="employee-dashboard">
            <h2>Pending Transactions</h2>
            {message && <p className="message">{message}</p>}
            {transactions.length > 0 ? (
                <div className="transactions-table-wrapper">
                    <table className="transactions-table">
                        <thead>
                            <tr>
                                <th>Payer Account</th>
                                <th>Recipient Account</th>
                                <th>Amount</th>
                                <th>Currency</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((transaction) => (
                                <tr key={transaction._id}>
                                    <td>{transaction.payerAccount}</td>
                                    <td>{transaction.recipientAccount}</td>
                                    <td>{transaction.amount}</td>
                                    <td>{transaction.currency}</td>
                                    <td>
                                        <button className="verify-button" onClick={() => handleVerify(transaction._id)}>
                                            Verify
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>No pending transactions.</p>
            )}
        </div>
    );
    
};

export default EmployeeDashboard;
