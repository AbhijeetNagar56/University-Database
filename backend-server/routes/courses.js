import express from "express";
import pool from "../db.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

router.get("/", asyncHandler(async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM Courses");
  res.json(rows);
}));

router.get("/:id", asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    "SELECT * FROM Courses WHERE course_id=?",
    [req.params.id]
  );
  res.json(rows);
}));

router.post("/", asyncHandler(async (req, res) => {
  await pool.query("INSERT INTO Courses SET ?", req.body);
  res.json({ message: "Course added" });
}));

router.put("/:id", asyncHandler(async (req, res) => {
  await pool.query("UPDATE Courses SET ? WHERE course_id=?", [
    req.body,
    req.params.id
  ]);

  res.json({ message: "Course updated" });
}));

router.delete("/:id", asyncHandler(async (req, res) => {
  await pool.query("DELETE FROM Courses WHERE course_id=?", [
    req.params.id
  ]);

  res.json({ message: "Course deleted" });
}));

export default router;
