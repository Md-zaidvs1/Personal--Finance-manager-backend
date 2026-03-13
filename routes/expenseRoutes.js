const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");
const { Parser } = require("json2csv");
const PDFDocument = require("pdfkit");

router.get("/", async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const expense = new Expense(req.body);
    await expense.save();
    res.json(expense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(expense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: "Expense deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/export/csv", async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    const fields = ["title", "amount", "category", "description", "date", "isRecurring"];
    const parser = new Parser({ fields });
    const csv = parser.parse(expenses);
    res.header("Content-Type", "text/csv");
    res.attachment("expenses.csv");
    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/export/pdf", async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    const doc = new PDFDocument({ margin: 40 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=expenses.pdf");
    doc.pipe(res);

    doc.fontSize(22).font("Helvetica-Bold").text("Personal Finance Manager", { align: "center" });
    doc.fontSize(12).font("Helvetica").text("Expense Report", { align: "center" });
    doc.moveDown();
    doc.moveTo(40, doc.y).lineTo(570, doc.y).stroke();
    doc.moveDown();

    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    doc.fontSize(13).font("Helvetica-Bold").text(`Total Expenses: Rs. ${total.toFixed(2)}`);
    doc.moveDown();

    doc.fontSize(11).font("Helvetica-Bold");
    doc.text("Title", 40, doc.y, { width: 120 });
    doc.text("Amount", 160, doc.y - doc.currentLineHeight(), { width: 80 });
    doc.text("Category", 240, doc.y - doc.currentLineHeight(), { width: 100 });
    doc.text("Date", 340, doc.y - doc.currentLineHeight(), { width: 100 });
    doc.text("Description", 440, doc.y - doc.currentLineHeight(), { width: 130 });
    doc.moveDown(0.3);
    doc.moveTo(40, doc.y).lineTo(570, doc.y).stroke();
    doc.moveDown(0.3);

    doc.font("Helvetica").fontSize(10);
    expenses.forEach((e) => {
      const y = doc.y;
      doc.text(e.title || "-", 40, y, { width: 120 });
      doc.text(`Rs. ${e.amount}`, 160, y, { width: 80 });
      doc.text(e.category || "-", 240, y, { width: 100 });
      doc.text(e.date ? new Date(e.date).toLocaleDateString() : "-", 340, y, { width: 100 });
      doc.text(e.description || "-", 440, y, { width: 130 });
      doc.moveDown(0.5);
    });

    doc.end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;