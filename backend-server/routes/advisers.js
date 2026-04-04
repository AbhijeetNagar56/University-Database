import express from "express";
import pool from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM Advisers");
  res.json(rows);
});

router.get("/:id", async (req, res) => {
  const [rows] = await pool.query(
    "SELECT * FROM Students WHERE adviser_id=?",
    [req.params.id]
  );
  res.json(rows);
});

router.post("/", async (req, res) => {
  await pool.query("INSERT INTO Advisers SET ?", req.body);
  res.json({ message: "Adviser added" });
});

router.put("/:id", async (req, res) => {
  await pool.query("UPDATE Advisers SET ? WHERE adviser_id=?", [
    req.body,
    req.params.id
  ]);

  res.json({ message: "Adviser updated" });
});

router.delete("/:id", async (req, res) => {
  await pool.query("DELETE FROM Advisers WHERE adviser_id=?", [
    req.params.id
  ]);

  res.json({ message: "Adviser deleted" });
});

export default router;