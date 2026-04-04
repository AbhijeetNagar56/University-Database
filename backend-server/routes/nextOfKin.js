import express from "express";
import pool from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM Next_of_Kin");
  res.json(rows);
});

router.get("/:id", async (req, res) => {
  const [rows] = await pool.query(
    "SELECT * FROM Students WHERE kin_id=?",
    [req.params.id]
  );
  res.json(rows);
});

router.post("/", async (req, res) => {
  await pool.query("INSERT INTO Next_of_Kin SET ?", req.body);
  res.json({ message: "Kin added" });
});

router.delete("/:id", async (req, res) => {
  await pool.query("DELETE FROM Next_of_Kin WHERE kin_id=?", [
    req.params.id
  ]);

  res.json({ message: "Kin deleted" });
});

export default router;