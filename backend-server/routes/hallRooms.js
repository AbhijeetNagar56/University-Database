import express from "express";
import pool from "../db.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

router.get("/", asyncHandler(async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM Hall_Rooms");
  res.json(rows);
}));

router.get("/:id", asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    "SELECT * FROM Hall_Rooms WHERE place_number=?",
    [req.params.id]
  );
  res.json(rows);
}));

router.post("/", asyncHandler(async (req, res) => {
  await pool.query("INSERT INTO Hall_Rooms SET ?", req.body);
  res.json({ message: "Room added" });
}));

router.put("/:id", asyncHandler(async (req, res) => {
  await pool.query("UPDATE Hall_Rooms SET ? WHERE place_number=?", [
    req.body,
    req.params.id
  ]);

  res.json({ message: "Room updated" });
}));

router.delete("/:id", asyncHandler(async (req, res) => {
  await pool.query("DELETE FROM Hall_Rooms WHERE place_number=?", [
    req.params.id
  ]);

  res.json({ message: "Room deleted" });
}));

export default router;
