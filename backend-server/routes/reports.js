import express from "express";
import pool from "../db.js";

const router = express.Router();

// (a) Present a report listing the Manager’s name and telephone number for each hall of residence.
router.get("/", async (req, res) => {
  const [rows] = await pool.query("");
  res.json(rows);
});

// (b) Present a report listing the names and banner numbers of students with the details of their lease agreements.
router.get("/", async (req, res) => {
  const [rows] = await pool.query("");
  res.json(rows);
});

// (c) Display the details of lease agreements that include the summer semester.
router.get("/", async (req, res) => {
  const [rows] = await pool.query("");
  res.json(rows);
});

// (d) Display the details of the total rent paid by a given student.
router.get("/", async (req, res) => {
  const [rows] = await pool.query("");
  res.json(rows);
});

// (e) Present a report on students who have not paid their invoices by a given date.
router.get("/", async (req, res) => {
  const [rows] = await pool.query("");
  res.json(rows);
});

// (f) Display the details of apartment inspections where the property was found to be in an unsatisfactory condition.
router.get("/", async (req, res) => {
  const [rows] = await pool.query("");
  res.json(rows);
});
// (g) Present a report of the names and banner numbers of students with their room number and place number in a particular hall of residence.
router.get("/", async (req, res) => {
  const [rows] = await pool.query("");
  res.json(rows);
});

// (h) Present a report listing the details of all students currently on the waiting list for accommodation; that is; who were not placed.
router.get("/", async (req, res) => {
  const [rows] = await pool.query("");
  res.json(rows);
});

// (i) Display the total number of students in each student category.
router.get("/", async (req, res) => {
  const [rows] = await pool.query("");
  res.json(rows);
});

// (j) Present a report of the names and banner numbers for all students who have not supplied details of their next-of-kin.
router.get("/", async (req, res) => {
  const [rows] = await pool.query("");
  res.json(rows);
});

// (k) Display the name and internal telephone number of the Adviser for a particular student.
router.get("/", async (req, res) => {
  const [rows] = await pool.query("");
  res.json(rows);
});

// (l) Display the minimum, maximum, and average monthly rent for rooms in residence halls.
router.get("/", async (req, res) => {
  const [rows] = await pool.query("");
  res.json(rows);
});

// (m) Display the total number of places in each residence hall.
router.get("/", async (req, res) => {
  const [rows] = await pool.query("");
  res.json(rows);
});

// (n) Display the staff number, name, age, and current location of all members of the residence staff who are over 60 years old today.
router.get("/", async (req, res) => {
  const [rows] = await pool.query("");
  res.json(rows);
});

export default router;