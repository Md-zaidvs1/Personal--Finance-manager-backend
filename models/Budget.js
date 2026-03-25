const mongoose = require("mongoose");

const BudgetSchema = new mongoose.Schema({
  category: { type: String, required: true },
  limit: { type: Number, required: true },
  period: { type: String, enum: ["monthly", "yearly"], default: "monthly" }
}, { timestamps: true });

module.exports = mongoose.model("Budget", BudgetSchema);