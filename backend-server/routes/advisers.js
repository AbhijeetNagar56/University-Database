import express from "express";
import pool from "../db.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

router.get("/", asyncHandler(async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM Advisers");
  res.json(rows);
}));

router.get("/:id", asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    "SELECT * FROM Advisers WHERE adviser_id=?",
    [req.params.id]
  );
  res.json(rows);
}));

router.post("/", asyncHandler(async (req, res) => {
  await pool.query("INSERT INTO Advisers SET ?", req.body);
  res.json({ message: "Adviser added" });
}));

router.put("/:id", asyncHandler(async (req, res) => {
  await pool.query("UPDATE Advisers SET ? WHERE adviser_id=?", [
    req.body,
    req.params.id
  ]);

  res.json({ message: "Adviser updated" });
}));

router.delete("/:id", asyncHandler(async (req, res) => {
  await pool.query("DELETE FROM Advisers WHERE adviser_id=?", [
    req.params.id
  ]);

  res.json({ message: "Adviser deleted" });
}));

export default router;
