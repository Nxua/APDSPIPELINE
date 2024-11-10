import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './EmployeeLogin.css';

const EmployeeLogin = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!username || !password) {
      setMessage("Username and password are required.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/employees/login", {
        username,
        password,
      });

      setMessage(response.data.message);
      console.log("Employee info:", response.data.employee);

      // Call onLoginSuccess to set loggedInEmployee in App
      onLoginSuccess(response.data.employee);

      // Navigate to the dashboard on successful login
      navigate("/employee-dashboard");
    } catch (error) {
      if (!error.response) {
        setMessage("Network error: Unable to connect to the server. Please try again later.");
        console.error("Network error:", error);
      } else {
        switch (error.response.status) {
          case 400:
            setMessage("Bad request: Please check your input and try again.");
            break;
          case 401:
            setMessage("Unauthorized: Incorrect username or password.");
            break;
          case 403:
            setMessage("Forbidden: You do not have access to this resource.");
            break;
          case 404:
            setMessage("Server not found: The requested resource could not be found.");
            break;
          case 500:
            setMessage("Server error: Something went wrong on our end. Please try again later.");
            break;
          default:
            setMessage("An unexpected error occurred. Please try again.");
        }
        console.error("Login error:", error.response.data);
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <h2 className="login-title">Employee Login</h2>
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
          <button type="submit" className="login-button">Login</button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default EmployeeLogin;
