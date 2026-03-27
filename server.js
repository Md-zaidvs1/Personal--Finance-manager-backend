const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config() // or import 'dotenv/config' if you're using ES6

const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const expenseRoutes = require("./routes/expenseRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const goalRoutes = require("./routes/goalRoutes");
const incomeRoutes = require("./routes/incomeRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/expenses", expenseRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/incomes", incomeRoutes);

console.log (process.env.MONGO_URI,"2" );
mongoose.connect(process.env.MONGO_URI)

  .then(() => console.log(" MongoDB Connected"))
  .catch(err => console.log(" MongoDB Error:", err));
  
  


app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});