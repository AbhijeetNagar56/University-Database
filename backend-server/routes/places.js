import express from "express";
import pool from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM Places");
  res.json(rows);
});

router.get("/:id", async (req, res) => {
  const [rows] = await pool.query(
    "SELECT * FROM Students WHERE place_number=?",
    [req.params.id]
  );
  res.json(rows);
});

router.get("/:id", async (req, res) => {
  const [rows] = await pool.query(
    "SELECT * FROM Places WHERE place_number=?",
    [req.params.id]
  );
  res.json(rows);
});

router.post("/", async (req, res) => {
  const data = req.body;

  await pool.query("INSERT INTO Places SET ?", data);
  res.json({ message: "inserted" });
});

router.put("/:id", async (req, res) => {
  await pool.query("UPDATE Places SET ? WHERE place_number=?", [
    req.body,
    req.params.id
  ]);

  res.json({ message: "updated" });
});

router.delete("/:id", async (req, res) => {
  await pool.query("DELETE FROM Places WHERE place_number=?", [
    req.params.id
  ]);

  res.json({ message: "deleted" });
});

export default router;