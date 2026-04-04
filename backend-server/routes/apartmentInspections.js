import express from "express";
import pool from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM Apartment_Inspections");
  res.json(rows);
});

router.get("/:id", async (req, res) => {
  const [rows] = await pool.query(
    "SELECT * FROM Students WHERE inspection_id=?",
    [req.params.id]
  );
  res.json(rows);
});

router.post("/", async (req, res) => {
  await pool.query("INSERT INTO Apartment_Inspections SET ?", req.body);
  res.json({ message: "Inspection added" });
});

router.delete("/:id", async (req, res) => {
  await pool.query("DELETE FROM Apartment_Inspections WHERE inspection_id=?", [
    req.params.id
  ]);

  res.json({ message: "Inspection deleted" });
});

export default router;