import express from "express";
import pool from "../db.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

router.get("/", asyncHandler(async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM Apartments");
  res.json(rows);
}));

router.get("/:id", asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    "SELECT * FROM Apartments WHERE apartment_id=?",
    [req.params.id]
  );
  res.json(rows);
}));

router.post("/", asyncHandler(async (req, res) => {
  await pool.query("INSERT INTO Apartments SET ?", req.body);
  res.json({ message: "Apartment added" });
}));

router.put("/:id", asyncHandler(async (req, res) => {
  await pool.query("UPDATE Apartments SET ? WHERE apartment_id=?", [
    req.body,
    req.params.id
  ]);

  res.json({ message: "Apartment updated" });
}));

router.delete("/:id", asyncHandler(async (req, res) => {
  await pool.query("DELETE FROM Apartments WHERE apartment_id=?", [
    req.params.id
  ]);

  res.json({ message: "Apartment deleted" });
}));

export default router;
