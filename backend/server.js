const express = require("express");
const bcrypt = require("bcrypt");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const crypto = require("crypto");
const sessionSecret = crypto.randomBytes(32).toString("hex");

console.log(sessionSecret);

const app = express();
const port = 5000;
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function connectDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}
connectDB();

// Middleware to parse JSON
app.use(express.json());
app.use(cors()); // Enable CORS for all routes
app.use(helmet()); // Secure HTTP headers

// Rate limiting to mitigate DDoS attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
});
app.use(limiter);

// MongoDB Database and Collections
const database = client.db("customerPaymentsDB");
const customersCollection = database.collection("customers");
const paymentsCollection = database.collection("payments");
const employeesCollection = database.collection("employees"); // For employee logins

// Session management
app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ client: client }),
    cookie: {
      httpOnly: true, // Prevents client-side JavaScript from accessing cookies
      secure: false, // Secure cookies only for HTTPS, set to false for HTTP
      maxAge: 1000 * 60 * 60, // 1 hr session expiration
    },
  })
);

// Input validation regex patterns
const namePattern = /^[a-zA-Z\s]+$/;
const idNumberPattern = /^\d{13}$/;
const accountNumberPattern = /^\d+$/;
const passwordPattern = /^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]{8,}$/;

// Customer Registration Route
app.post("/api/register", async (req, res) => {
  const { fullName, idNumber, accountNumber, password } = req.body;

  if (!fullName || !namePattern.test(fullName) || !idNumber || !idNumberPattern.test(idNumber) || !accountNumber || !accountNumberPattern.test(accountNumber) || !password || !passwordPattern.test(password)) {
    return res.status(400).json({ message: "Invalid input fields" });
  }

  const existingCustomer = await customersCollection.findOne({ accountNumber });
  if (existingCustomer) return res.status(400).json({ message: "Customer already registered" });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await customersCollection.insertOne({
      fullName,
      idNumber,
      accountNumber,
      password: hashedPassword,
      balance: 10000.0,
    });
    res.status(201).json({ message: "Customer registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Customer Login Route
app.post("/api/login", async (req, res) => {
  const { accountNumber, password } = req.body;
  if (!accountNumber || !password) return res.status(400).json({ message: "Account number and password are required" });

  try {
    const customer = await customersCollection.findOne({ accountNumber });
    if (!customer) return res.status(400).json({ message: "Invalid account number or password" });

    const passwordMatch = await bcrypt.compare(password, customer.password);
    if (!passwordMatch) return res.status(400).json({ message: "Invalid account number or password" });

    res.status(200).json({
      message: "Login successful",
      customer: {
        accountNumber: customer.accountNumber,
        fullName: customer.fullName,
        balance: customer.balance,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Employee Login Route
app.post("/api/employees/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: "Username and password are required" });

  try {
    const employee = await employeesCollection.findOne({ username });
    if (!employee) return res.status(400).json({ message: "Invalid username or password" });

    const passwordMatch = await bcrypt.compare(password, employee.password);
    if (!passwordMatch) return res.status(400).json({ message: "Invalid username or password" });

    res.status(200).json({
      message: "Login successful",
      employee: {
        username: employee.username,
        role: employee.role,
        fullName: employee.fullName
      },
    });
  } catch (error) {
    console.error("Employee login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Payment Processing Route (Backend)
app.post("/api/payment", async (req, res) => {
  const { payerAccount, recipientAccount, amount, currency, provider } = req.body;
  if (!payerAccount || !recipientAccount || !amount || !currency || !provider) {
      return res.status(400).json({ message: "All fields are required" });
  }

  try {
      const payer = await customersCollection.findOne({ accountNumber: payerAccount });
      if (!payer) return res.status(400).json({ message: "Payer account not found" });
      if (payer.balance < amount) return res.status(400).json({ message: "Insufficient balance" });

      const recipient = await customersCollection.findOne({ accountNumber: recipientAccount });
      if (!recipient) return res.status(400).json({ message: "Recipient account not found" });

      // Create a pending payment without deducting balance
      const paymentData = {
          payerAccount,
          recipientAccount,
          amount: parseFloat(amount),
          currency,
          provider,
          verified: false, // Set transaction to pending
          timestamp: new Date(),
      };
      await paymentsCollection.insertOne(paymentData);

      res.status(200).json({ message: "Payment submitted for verification" });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
  }
});

// Fetch Pending Transactions for Employee Verification
app.get('/api/employees/transactions', async (req, res) => {
  try {
    const pendingTransactions = await paymentsCollection.find({ verified: false }).toArray();
    res.status(200).json(pendingTransactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify a Transaction
app.put('/api/employees/transactions/:transactionId/verify', async (req, res) => {
  const { transactionId } = req.params;

  try {
      const transaction = await paymentsCollection.findOne({ _id: new ObjectId(transactionId) });
      if (!transaction) return res.status(404).json({ message: 'Transaction not found.' });
      if (transaction.verified) return res.status(400).json({ message: 'Transaction already verified.' });

      // Deduct the amount from the payer and add to the recipient
      const payer = await customersCollection.findOne({ accountNumber: transaction.payerAccount });
      const recipient = await customersCollection.findOne({ accountNumber: transaction.recipientAccount });

      if (payer.balance < transaction.amount) {
          return res.status(400).json({ message: "Insufficient balance for transfer." });
      }

      const newPayerBalance = payer.balance - transaction.amount;
      const newRecipientBalance = recipient.balance + transaction.amount;

      await customersCollection.updateOne({ accountNumber: payer.accountNumber }, { $set: { balance: newPayerBalance } });
      await customersCollection.updateOne({ accountNumber: recipient.accountNumber }, { $set: { balance: newRecipientBalance } });

      // Mark transaction as verified
      const result = await paymentsCollection.updateOne(
          { _id: new ObjectId(transactionId) },
          { $set: { verified: true } }
      );

      if (result.modifiedCount === 1) {
          res.status(200).json({ message: 'Transaction verified successfully.' });
      } else {
          res.status(500).json({ message: 'Transaction verification failed.' });
      }
  } catch (error) {
      console.error('Error verifying transaction:', error);
      res.status(500).json({ message: 'Server error' });
  }
});


// Get Payment History Route
app.get("/api/payments/:accountNumber", async (req, res) => {
  const { accountNumber } = req.params;

  try {
    const sentPayments = await paymentsCollection.find({ payerAccount: accountNumber }).toArray();
    const receivedPayments = await paymentsCollection.find({ recipientAccount: accountNumber }).toArray();

    const payments = [
      ...sentPayments.map((payment) => ({ ...payment, type: "Sent" })),
      ...receivedPayments.map((payment) => ({ ...payment, type: "Received" })),
    ];

    res.status(200).json(payments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Start the HTTP server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
