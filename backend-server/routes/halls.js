import express from "express";
import pool from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM Halls");
  res.json(rows);
});

router.post("/", async (req, res) => {
  await pool.query("INSERT INTO Halls SET ?", req.body);
  res.json({ message: "Hall added" });
});

router.put("/:id", async (req, res) => {
  await pool.query("UPDATE Halls SET ? WHERE hall_id=?", [
    req.body,
    req.params.id
  ]);

  res.json({ message: "Hall updated" });
});

router.delete("/:id", async (req, res) => {
  await pool.query("DELETE FROM Halls WHERE hall_id=?", [req.params.id]);
  res.json({ message: "Hall deleted" });
});

export default router;