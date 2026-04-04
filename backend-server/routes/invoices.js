import express from "express";
import pool from "../db.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

router.get("/", asyncHandler(async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM Invoices");
  res.json(rows);
}));

router.get("/:id", asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    "SELECT * FROM Invoices WHERE invoice_id=?",
    [req.params.id]
  );
  res.json(rows);
}));

router.post("/", asyncHandler(async (req, res) => {
  await pool.query("INSERT INTO Invoices SET ?", req.body);
  res.json({ message: "Invoice created" });
}));

router.put("/:id", asyncHandler(async (req, res) => {
  await pool.query("UPDATE Invoices SET ? WHERE invoice_id=?", [
    req.body,
    req.params.id
  ]);

  res.json({ message: "Invoice updated" });
}));

router.delete("/:id", asyncHandler(async (req, res) => {
  await pool.query("DELETE FROM Invoices WHERE invoice_id=?", [
    req.params.id
  ]);

  res.json({ message: "Invoice deleted" });
}));

export default router;
