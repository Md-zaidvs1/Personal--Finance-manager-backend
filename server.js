require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const expenseRoutes = require("./routes/expenseRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const goalRoutes = require("./routes/goalRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const authRoutes = require("./routes/auth");
const auth = require("./middleware/auth");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/expenses", auth, expenseRoutes);
app.use("/api/budgets", auth, budgetRoutes);
app.use("/api/goals", auth, goalRoutes);
app.use("/api/incomes", auth, incomeRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ MongoDB Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});