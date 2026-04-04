import express from "express";
import pool from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM Residence_Staff");
  res.json(rows);
});

router.get("/:id", async (req, res) => {
  const [rows] = await pool.query(
    "SELECT * FROM Students WHERE staff_id=?",
    [req.params.id]
  );
  res.json(rows);
});

router.post("/", async (req, res) => {
  await pool.query("INSERT INTO Residence_Staff SET ?", req.body);
  res.json({ message: "Staff added" });
});

router.put("/:id", async (req, res) => {
  await pool.query("UPDATE Residence_Staff SET ? WHERE staff_id=?", [
    req.body,
    req.params.id
  ]);

  res.json({ message: "Staff updated" });
});

router.delete("/:id", async (req, res) => {
  await pool.query("DELETE FROM Residence_Staff WHERE staff_id=?", [
    req.params.id
  ]);

  res.json({ message: "Staff deleted" });
});

export default router;