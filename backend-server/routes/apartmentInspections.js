import express from "express";
import pool from "../db.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

router.get("/", asyncHandler(async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM Apartment_Inspections");
  res.json(rows);
}));

router.get("/:id", asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    "SELECT * FROM Apartment_Inspections WHERE inspection_id=?",
    [req.params.id]
  );
  res.json(rows);
}));

router.post("/", asyncHandler(async (req, res) => {
  await pool.query("INSERT INTO Apartment_Inspections SET ?", req.body);
  res.json({ message: "Inspection added" });
}));

router.put("/:id", asyncHandler(async (req, res) => {
  await pool.query("UPDATE Apartment_Inspections SET ? WHERE inspection_id=?", [
    req.body,
    req.params.id
  ]);

  res.json({ message: "Inspection updated" });
}));

router.delete("/:id", asyncHandler(async (req, res) => {
  await pool.query("DELETE FROM Apartment_Inspections WHERE inspection_id=?", [
    req.params.id
  ]);

  res.json({ message: "Inspection deleted" });
}));

export default router;
