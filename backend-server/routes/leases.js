import express from "express";
import pool from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM Leases");
  res.json(rows);
});

router.post("/", async (req, res) => {
  await pool.query("INSERT INTO Leases SET ?", req.body);
  res.json({ message: "Lease created" });
});

router.put("/:id", async (req, res) => {
  await pool.query("UPDATE Leases SET ? WHERE lease_id=?", [
    req.body,
    req.params.id
  ]);

  res.json({ message: "Lease updated" });
});

router.delete("/:id", async (req, res) => {
  await pool.query("DELETE FROM Leases WHERE lease_id=?", [req.params.id]);
  res.json({ message: "Lease deleted" });
});

export default router;