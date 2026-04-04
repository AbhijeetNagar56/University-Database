import express from "express";
import pool from "../db.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

router.get("/", asyncHandler(async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM Residence_Staff");
  res.json(rows);
}));

router.get("/:id", asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    "SELECT * FROM Residence_Staff WHERE staff_id=?",
    [req.params.id]
  );
  res.json(rows);
}));

router.post("/", asyncHandler(async (req, res) => {
  await pool.query("INSERT INTO Residence_Staff SET ?", req.body);
  res.json({ message: "Staff added" });
}));

router.put("/:id", asyncHandler(async (req, res) => {
  await pool.query("UPDATE Residence_Staff SET ? WHERE staff_id=?", [
    req.body,
    req.params.id
  ]);

  res.json({ message: "Staff updated" });
}));

router.delete("/:id", asyncHandler(async (req, res) => {
  await pool.query("DELETE FROM Residence_Staff WHERE staff_id=?", [
    req.params.id
  ]);

  res.json({ message: "Staff deleted" });
}));

export default router;
