import express from "express";
import pool from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM Courses");
  res.json(rows);
});

router.post("/", async (req, res) => {
  await pool.query("INSERT INTO Courses SET ?", req.body);
  res.json({ message: "Course added" });
});

router.put("/:id", async (req, res) => {
  await pool.query("UPDATE Courses SET ? WHERE course_id=?", [
    req.body,
    req.params.id
  ]);

  res.json({ message: "Course updated" });
});

router.delete("/:id", async (req, res) => {
  await pool.query("DELETE FROM Courses WHERE course_id=?", [
    req.params.id
  ]);

  res.json({ message: "Course deleted" });
});

export default router;