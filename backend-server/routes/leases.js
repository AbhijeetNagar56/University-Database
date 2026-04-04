import express from "express";
import pool from "../db.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

router.get("/", asyncHandler(async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM Leases");
  res.json(rows);
}));

router.get("/:id", asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    "SELECT * FROM Leases WHERE lease_id=?",
    [req.params.id]
  );
  res.json(rows);
}));

router.post("/", asyncHandler(async (req, res) => {
  await pool.query("INSERT INTO Leases SET ?", req.body);
  res.json({ message: "Lease created" });
}));

router.put("/:id", asyncHandler(async (req, res) => {
  await pool.query("UPDATE Leases SET ? WHERE lease_id=?", [
    req.body,
    req.params.id
  ]);

  res.json({ message: "Lease updated" });
}));

router.delete("/:id", asyncHandler(async (req, res) => {
  await pool.query("DELETE FROM Leases WHERE lease_id=?", [req.params.id]);
  res.json({ message: "Lease deleted" });
}));

export default router;
