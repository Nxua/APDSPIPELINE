# Nexaro Banking

## 1. Purpose
This project is a secure customer portal for Nexaro, an international bank, allowing customers to register, log in, and make payments seamlessly. Nexaro aims to provide a secure and user-friendly platform to manage international payments efficiently. The project is developed using Express.js for the backend API and MongoDB for data storage. The frontend is built with React.js. This project, developed by Nishaylin Sigamoney, Luke Sowray, and Samuel Bekhet, aims to provide a secure banking experience for the user.

## 2. Features
- Customer Registration: New customers can register by providing their full name, ID number, account number, and password.
- Customer Login: Registered customers can log in using their account number and password.
- Payment Feature: Customers can send payments by specifying the recipient account, amount, currency, and provider.
- Payment History: Customers can view their payment history, including sent and received transactions.

## 3. Security Features:
- Password hashing using bcrypt with added pepper.
- Rate limiting to mitigate DDoS attacks.
- Helmet middleware for securing HTTP headers.
- Input sanitization and validation using regex patterns.
- Sessions managed securely with express-session and connect-mongo.

## 3. Technologies Used
Nexaro leverages a range of technologies to deliver its features effectively:

- Backend: Node.js, Express.js
- Frontend: React.js
- Database: MongoDB (MongoDB Compass for GUI management)
- Security: bcrypt, crypto, helmet, rate-limit, CORS
- GitHub: Version control and collaboration tool used for managing the project’s source code, tracking changes, and collaborating among the development team.

## 4. Installation and Compilation
To set up and run Nexaro on your local device, follow the steps below:

### 4.1 Prerequisites
- Node.js (v14 or later)
- MongoDB (local installation or access to a cloud instance)
- npm (comes with Node.js)

### 4.2 Steps
1. Clone the repository
- git clone <https://github.com/VCSTDN2024/apda7311-part-nexaro-apds>
- cd customer-payments-portal

2. Install Dependancies
- npm install

3. Start MongoDb 
- ensure your MongoDb server is running on: mongodb://localhost:27017
- update server.js if your MongoDb is on a different URL

4. Environment Variables (You may want to set the following environment variables in a new .env file)
- MONGO_URI=mongodb://localhost:27017
- SESSION_SECRET=your-session-secret

5. Run the server
- node server.js
- http://localhost:5000/

6. Run the frontend Navigate to tthe frontend directory and run
- npm Start

## 5. Running: API Endpoints

### 5.1 POST /api/register

- Registers a new customer.
- URL: http://localhost:5000/api/register
- Body (JSON):
{
  "fullName": "John Doe",
  "idNumber": "1234567890123",
  "accountNumber": "9876543210",
  "password": "MySecurePassword1!"
}
- Response: 201 Created on success.

### 5.2 POST /api/login

- Logs in an existing customer.
- URL: http://localhost:5000/api/login
- Body (JSON): 
{
  "accountNumber": "9876543210",
  "password": "MySecurePassword1!"
}
- Response: 200 OK on success, with customer details.

### 5.3 POST /api/payment

- Sends a payment to another account.
- URL: http://localhost:5000/api/payment
- Body (JSON):
{
  "payerAccount": "9876543210",
  "recipientAccount": "1234567890",
  "amount": 100,
  "currency": "USD",
  "provider": "SWIFT"
}
- Response: 200 OK on success, with updated balance

### 5.4 GET /api/payments/

- Fetches the payment history for a given account.
- URL: http://localhost:5000/api/payments/:accountNumber
- Response: 200 OK with payment details.

## 6 Security Measures

- Password Security: Passwords are hashed with bcrypt and an added pepper for extra security.
- Input Validation and Sanitization: All inputs are validated using regular expressions and sanitized to prevent injection attacks.
- HTTP Headers: Secured using helmet middleware.
- Rate Limiting: Limits the number of requests from a single IP to mitigate DDoS attacks.

## 7. DevSecOps Pipeline

- To ensure security and reliability, a basic DevSecOps pipeline is configured and triggered whenever code is pushed to the repository. This pipeline includes:

- Linting and Static Code Analysis: Automated code checks to enforce code quality and identify potential vulnerabilities.

- Unit Tests: Running automated unit tests to ensure application logic correctness.

- Build and Deploy: Building the application and deploying it to a staging environment for further testing.

The pipeline is triggered through a CI/CD tool being GitHub Actions, ensuring a smooth and secure development process.

## 8. Authors
- Nishaylin Sigamoney -ST10077060 - Developer 
- Luke Sowray -ST10025289 - Developer
- Samuel Bekhet -ST10026652 - Developer