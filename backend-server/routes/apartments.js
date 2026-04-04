import express from "express";
import pool from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM Apartments");
  res.json(rows);
});

router.get("/:id", async (req, res) => {
  const [rows] = await pool.query(
    "SELECT * FROM Students WHERE apartment_id=?",
    [req.params.id]
  );
  res.json(rows);
});

router.post("/", async (req, res) => {
  await pool.query("INSERT INTO Apartments SET ?", req.body);
  res.json({ message: "Apartment added" });
});

router.put("/:id", async (req, res) => {
  await pool.query("UPDATE Apartments SET ? WHERE apartment_id=?", [
    req.body,
    req.params.id
  ]);

  res.json({ message: "Apartment updated" });
});

router.delete("/:id", async (req, res) => {
  await pool.query("DELETE FROM Apartments WHERE apartment_id=?", [
    req.params.id
  ]);

  res.json({ message: "Apartment deleted" });
});

export default router;