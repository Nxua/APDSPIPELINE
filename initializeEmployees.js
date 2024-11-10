// initializeEmployees.js
const bcrypt = require("bcrypt");
const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

const employees = [
  { username: "admin1", password: "password123", role: "admin" },
  { username: "employee1", password: "password123", role: "employee" },
  { username: "employee2", password: "password123", role: "employee" }
];

async function initializeEmployees() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const database = client.db("customerPaymentsDB");
    const employeesCollection = database.collection("employees");

    // Check if employees already exist
    const existingEmployees = await employeesCollection.find().toArray();
    if (existingEmployees.length === 0) {
      // Hash passwords and insert employees
      const saltRounds = 10;
      const hashedEmployees = await Promise.all(
        employees.map(async (employee) => ({
          username: employee.username,
          password: await bcrypt.hash(employee.password, saltRounds),
          role: employee.role,
        }))
      );

      await employeesCollection.insertMany(hashedEmployees);
      console.log("Predefined employees inserted successfully");
    } else {
      console.log("Employees already initialized");
    }
  } catch (error) {
    console.error("Error initializing employees:", error);
  } finally {
    await client.close();
  }
}

initializeEmployees();
