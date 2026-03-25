const mongoose = require("mongoose");

const GoalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  targetAmount: { type: Number, required: true },
  savedAmount: { type: Number, default: 0 },
  deadline: { type: Date, required: true },
  description: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model("Goal", GoalSchema);