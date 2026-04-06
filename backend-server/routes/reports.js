import express from "express";
import pool from "../db.js";

const router = express.Router();

// (a) Present a report listing the Manager's name and telephone number for each hall of residence.
router.get("/hall-managers", async (_req, res) => {
  const [rows] = await pool.query(`
    SELECT
      h.hall_id,
      h.hall_name,
      CONCAT(rs.first_name, ' ', rs.last_name) AS manager_name,
      h.telephone
    FROM Halls h
    LEFT JOIN Residence_Staff rs ON h.manager_staff_id = rs.staff_id
    ORDER BY h.hall_name
  `);
  res.json(rows);
});

// (b) Present a report listing the names and banner numbers of students with the details of their lease agreements.
router.get("/students-leases", async (_req, res) => {
  const [rows] = await pool.query(`
    SELECT
      s.banner_number,
      s.first_name,
      s.last_name,
      l.lease_id,
      l.place_number,
      l.room_number,
      l.address,
      l.lease_duration_semesters,
      l.start_date,
      l.end_date
    FROM Students s
    INNER JOIN Leases l ON s.banner_number = l.banner_number
    ORDER BY s.banner_number, l.start_date DESC
  `);
  res.json(rows);
});

// (c) Display the details of lease agreements that include the summer semester.
router.get("/summer-leases", async (_req, res) => {
  const [rows] = await pool.query(`
    SELECT *
    FROM Leases
    WHERE lease_duration_semesters >= 3
    ORDER BY start_date DESC
  `);
  res.json(rows);
});

// (d) Display the details of the total rent paid by a given student.
router.get("/student-rent/:bannerNumber", async (req, res) => {
  const [rows] = await pool.query(
    `
      SELECT
        s.banner_number,
        s.first_name,
        s.last_name,
        COUNT(i.invoice_id) AS invoices_paid,
        COALESCE(SUM(i.payment_due), 0) AS total_rent_paid
      FROM Students s
      LEFT JOIN Invoices i
        ON s.banner_number = i.banner_number
       AND i.date_paid IS NOT NULL
      WHERE s.banner_number = ?
      GROUP BY s.banner_number, s.first_name, s.last_name
    `,
    [req.params.bannerNumber]
  );
  res.json(rows);
});

// (e) Present a report on students who have not paid their invoices by a given date.
router.get("/unpaid-invoices", async (req, res) => {
  const cutoffDate = new Date();
  const [rows] = await pool.query(
    `
      SELECT
        s.banner_number,
        s.first_name,
        s.last_name,
        i.invoice_id,
        i.semester,
        i.payment_due,
        i.date_paid,
        i.first_reminder_date,
        i.second_reminder_date
      FROM Invoices i
      INNER JOIN Students s ON i.banner_number = s.banner_number
      WHERE i.date_paid IS NULL
        OR i.date_paid > ?
        AND (
          i.first_reminder_date <= ?
          OR i.second_reminder_date <= ?
        )
      ORDER BY s.banner_number, i.invoice_id
    `,
    [cutoffDate, cutoffDate, cutoffDate]
  );
  res.json(rows);
});

// (f) Display the details of apartment inspections where the property was found to be in an unsatisfactory condition.
router.get("/unsatisfactory-inspections", async (_req, res) => {
  const [rows] = await pool.query(`
    SELECT
      ai.inspection_id,
      ai.apartment_id,
      ai.staff_id,
      ai.inspection_date,
      ai.satisfactory,
      ai.comments,
      a.street,
      a.city,
      a.postcode
    FROM Apartment_Inspections ai
    INNER JOIN Apartments a ON ai.apartment_id = a.apartment_id
    WHERE ai.satisfactory = 0
    ORDER BY ai.inspection_date DESC
  `);
  res.json(rows);
});

// (g) Present a report of the names and banner numbers of students with their room number and place number in a particular hall of residence.
router.get("/hall-students/:hallId", async (req, res) => {
  const [rows] = await pool.query(
    `
      SELECT
        s.banner_number,
        s.first_name,
        s.last_name,
        hr.room_number,
        hr.place_number,
        h.hall_id,
        h.hall_name
      FROM Leases l
      INNER JOIN Students s ON l.banner_number = s.banner_number
      INNER JOIN Hall_Rooms hr ON l.place_number = hr.place_number
      INNER JOIN Halls h ON hr.hall_id = h.hall_id
      WHERE h.hall_id = ?
      ORDER BY hr.room_number, s.banner_number
    `,
    [req.params.hallId]
  );
  res.json(rows);
});

// (h) Present a report listing the details of all students currently on the waiting list for accommodation; that is, who were not placed.
router.get("/waiting-list", async (_req, res) => {
  const [rows] = await pool.query(`
    SELECT s.*
    FROM Students s
    LEFT JOIN Leases l
      ON s.banner_number = l.banner_number
     AND CURDATE() BETWEEN l.start_date AND l.end_date
    WHERE l.lease_id IS NULL
      AND (
        LOWER(COALESCE(s.status, '')) LIKE '%waiting%'
        OR LOWER(COALESCE(s.status, '')) LIKE '%not placed%'
      )
    ORDER BY s.banner_number
  `);
  res.json(rows);
});

// (i) Display the total number of students in each student category.
router.get("/student-category-count", async (_req, res) => {
  const [rows] = await pool.query(`
    SELECT
      student_category,
      COUNT(*) AS total_students
    FROM Students
    GROUP BY student_category
    ORDER BY student_category
  `);
  res.json(rows);
});

// (j) Present a report of the names and banner numbers for all students who have not supplied details of their next-of-kin.
router.get("/students-without-kin", async (_req, res) => {
  const [rows] = await pool.query(`
    SELECT
      s.banner_number,
      s.first_name,
      s.last_name
    FROM Students s
    LEFT JOIN Next_of_Kin k ON s.banner_number = k.banner_number
    WHERE k.kin_id IS NULL
    ORDER BY s.banner_number
  `);
  res.json(rows);
});

// (k) Display the name and internal telephone number of the Adviser for a particular student.
router.get("/student-adviser/:bannerNumber", async (req, res) => {
  const [rows] = await pool.query(
    `
      SELECT
        s.banner_number,
        s.first_name,
        s.last_name,
        a.full_name AS adviser_name,
        a.internal_phone
      FROM Students s
      INNER JOIN Advisers a ON s.adviser_id = a.adviser_id
      WHERE s.banner_number = ?
    `,
    [req.params.bannerNumber]
  );
  res.json(rows);
});

// (l) Display the minimum, maximum, and average monthly rent for rooms in residence halls.
router.get("/hall-rent-stats", async (_req, res) => {
  const [rows] = await pool.query(`
    SELECT
      MIN(monthly_rent) AS minimum_monthly_rent,
      MAX(monthly_rent) AS maximum_monthly_rent,
      AVG(monthly_rent) AS average_monthly_rent
    FROM Hall_Rooms
  `);
  res.json(rows);
});

// (m) Display the total number of places in each residence hall.
router.get("/hall-place-count", async (_req, res) => {
  const [rows] = await pool.query(`
    SELECT
      h.hall_id,
      h.hall_name,
      COUNT(hr.place_number) AS total_places
    FROM Halls h
    LEFT JOIN Hall_Rooms hr ON h.hall_id = hr.hall_id
    GROUP BY h.hall_id, h.hall_name
    ORDER BY h.hall_name
  `);
  res.json(rows);
});

// (n) Display the staff number, name, age, and current location of all members of the residence staff who are over 60 years old today.
router.get("/senior-staff", async (_req, res) => {
  const [rows] = await pool.query(`
    SELECT
      staff_id,
      CONCAT(first_name, ' ', last_name) AS full_name,
      TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) AS age,
      location
    FROM Residence_Staff
    WHERE TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) > 60
    ORDER BY age DESC, staff_id
  `);
  res.json(rows);
});

export default router;
