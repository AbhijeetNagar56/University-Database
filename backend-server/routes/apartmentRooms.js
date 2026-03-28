import express from "express";
import pool from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM Apartment_Rooms");
  res.json(rows);
});

router.post("/", async (req, res) => {
  await pool.query("INSERT INTO Apartment_Rooms SET ?", req.body);
  res.json({ message: "Apartment room added" });
});

router.put("/:id", async (req, res) => {
  await pool.query("UPDATE Apartment_Rooms SET ? WHERE place_number=?", [
    req.body,
    req.params.id
  ]);

  res.json({ message: "Room updated" });
});

router.delete("/:id", async (req, res) => {
  await pool.query("DELETE FROM Apartment_Rooms WHERE place_number=?", [
    req.params.id
  ]);

  res.json({ message: "Room deleted" });
});

export default router;