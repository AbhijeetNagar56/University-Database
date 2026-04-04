import express from "express";
import pool from "../db.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

router.get("/", asyncHandler(async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM Students");
  res.json(rows);
}));

router.get("/:id", asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    "SELECT * FROM Students WHERE banner_number=?",
    [req.params.id]
  );
  res.json(rows);
}));

router.post("/", asyncHandler(async (req, res) => {
  const data = req.body;

  await pool.query("INSERT INTO Students SET ?", data);
  res.json({ message: "Student inserted" });
}));

router.put("/:id", asyncHandler(async (req, res) => {
  await pool.query("UPDATE Students SET ? WHERE banner_number=?", [
    req.body,
    req.params.id
  ]);

  res.json({ message: "Student updated" });
}));

router.delete("/:id", asyncHandler(async (req, res) => {
  await pool.query("DELETE FROM Students WHERE banner_number=?", [
    req.params.id
  ]);

  res.json({ message: "Student deleted" });
}));

export default router;
