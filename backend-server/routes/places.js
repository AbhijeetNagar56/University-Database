import express from "express";
import pool from "../db.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

router.get("/", asyncHandler(async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM Places");
  res.json(rows);
}));

router.get("/:id", asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    "SELECT * FROM Places WHERE place_number=?",
    [req.params.id]
  );
  res.json(rows);
}));

router.post("/", asyncHandler(async (req, res) => {
  const data = req.body;

  await pool.query("INSERT INTO Places SET ?", data);
  res.json({ message: "inserted" });
}));

router.put("/:id", asyncHandler(async (req, res) => {
  await pool.query("UPDATE Places SET ? WHERE place_number=?", [
    req.body,
    req.params.id
  ]);

  res.json({ message: "updated" });
}));

router.delete("/:id", asyncHandler(async (req, res) => {
  await pool.query("DELETE FROM Places WHERE place_number=?", [
    req.params.id
  ]);

  res.json({ message: "deleted" });
}));

export default router;
