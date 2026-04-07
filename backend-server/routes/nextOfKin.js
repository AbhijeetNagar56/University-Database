import express from "express";
import pool from "../db.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

router.get("/", asyncHandler(async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM Next_of_Kin");
  res.json(rows);
}));

router.get("/:id", asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    "SELECT * FROM Next_of_Kin WHERE kin_id=?",
    [req.params.id]
  );
  res.json(rows);
}));

router.post("/", asyncHandler(async (req, res) => {
  await pool.query("INSERT INTO Next_of_Kin SET ?", req.body);
  res.json({ message: "Kin added" });
}));

router.put("/:id", asyncHandler(async (req, res) => {
  await pool.query("UPDATE Next_of_Kin SET ? WHERE kin_id=?", [
    req.body,
    req.params.id
  ]);

  res.json({ message: "Kin updated" });
}));

router.delete("/:id", asyncHandler(async (req, res) => {
  await pool.query("DELETE FROM Next_of_Kin WHERE kin_id=?", [
    req.params.id
  ]);

  res.json({ message: "Kin deleted" });
}));

export default router;
