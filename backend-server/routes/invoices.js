import express from "express";
import pool from "../db.js";

const router = express.Router();

// Get unpaid invoices by date
router.get("/unpaid", async (req, res) => {
  const { date } = req.query;
  try {
    const [rows] = await pool.query(
      "SELECT * FROM Invoices WHERE paidDate IS NULL AND dueDate < ?",
      [date]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
