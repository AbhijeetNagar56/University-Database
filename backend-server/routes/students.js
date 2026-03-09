import express from "express";
import pool from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM Students");
  res.json(rows);
});

router.get("/:id", async (req, res) => {
  const [rows] = await pool.query(
    "SELECT * FROM Students WHERE banner_number=?",
    [req.params.id]
  );
  res.json(rows);
});

router.post("/", async (req, res) => {
  const data = req.body;

  await pool.query("INSERT INTO Students SET ?", data);
  res.json({ message: "Student inserted" });
});

router.put("/:id", async (req, res) => {
  await pool.query("UPDATE Students SET ? WHERE banner_number=?", [
    req.body,
    req.params.id
  ]);

  res.json({ message: "Student updated" });
});

router.delete("/:id", async (req, res) => {
  await pool.query("DELETE FROM Students WHERE banner_number=?", [
    req.params.id
  ]);

  res.json({ message: "Student deleted" });
});

export default router;