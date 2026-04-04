import express from "express";
import pool from "../db.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

router.get("/", asyncHandler(async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM Halls");
  res.json(rows);
}));

router.get("/:id", asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    "SELECT * FROM Halls WHERE hall_id=?",
    [req.params.id]
  );
  res.json(rows);
}));

router.post("/", asyncHandler(async (req, res) => {
  await pool.query("INSERT INTO Halls SET ?", req.body);
  res.json({ message: "Hall added" });
}));

router.put("/:id", asyncHandler(async (req, res) => {
  await pool.query("UPDATE Halls SET ? WHERE hall_id=?", [
    req.body,
    req.params.id
  ]);

  res.json({ message: "Hall updated" });
}));

router.delete("/:id", asyncHandler(async (req, res) => {
  await pool.query("DELETE FROM Halls WHERE hall_id=?", [req.params.id]);
  res.json({ message: "Hall deleted" });
}));

export default router;
