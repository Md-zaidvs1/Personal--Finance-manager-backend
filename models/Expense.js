const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String, default: "" },
  date: { type: Date, default: Date.now },
  isRecurring: { type: Boolean, default: false },
  recurringFrequency: { type: String, enum: ["monthly", "weekly", "yearly", ""], default: "" }
}, { timestamps: true });

module.exports = mongoose.model("Expense", ExpenseSchema);