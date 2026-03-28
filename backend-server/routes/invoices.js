import express from "express";
import pool from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM Invoices");
  res.json(rows);
});

router.post("/", async (req, res) => {
  await pool.query("INSERT INTO Invoices SET ?", req.body);
  res.json({ message: "Invoice created" });
});

router.put("/:id", async (req, res) => {
  await pool.query("UPDATE Invoices SET ? WHERE invoice_id=?", [
    req.body,
    req.params.id
  ]);

  res.json({ message: "Invoice updated" });
});

router.delete("/:id", async (req, res) => {
  await pool.query("DELETE FROM Invoices WHERE invoice_id=?", [
    req.params.id
  ]);

  res.json({ message: "Invoice deleted" });
});

export default router;