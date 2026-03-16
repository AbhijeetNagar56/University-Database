import express from "express";
import cors from "cors";
import path from "path";
import multer from "multer";
import csv from "csv-parser";
import fs from "fs";
import { fileURLToPath } from "url";

import studentsRoutes from "./routes/students.js";
import advisersRoutes from "./routes/advisers.js";
import coursesRoutes from "./routes/courses.js";
import residenceStaffRoutes from "./routes/residenceStaff.js";
import hallsRoutes from "./routes/halls.js";
import hallRoomsRoutes from "./routes/hallRooms.js";
import apartmentsRoutes from "./routes/apartments.js";
import apartmentRoomsRoutes from "./routes/apartmentRooms.js";
import leasesRoutes from "./routes/leases.js";
import invoicesRoutes from "./routes/invoices.js";
import inspectionsRoutes from "./routes/apartmentInspections.js";
import kinRoutes from "./routes/nextOfKin.js";

import pool from "./db.js";

const app = express();
const PORT = process.env.PORT || 5000;

// __dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/students", studentsRoutes);
app.use("/advisers", advisersRoutes);
app.use("/courses", coursesRoutes);
app.use("/staff", residenceStaffRoutes);
app.use("/halls", hallsRoutes);
app.use("/hallrooms", hallRoomsRoutes);
app.use("/apartments", apartmentsRoutes);
app.use("/apartmentrooms", apartmentRoomsRoutes);
app.use("/leases", leasesRoutes);
app.use("/invoices", invoicesRoutes);
app.use("/inspections", inspectionsRoutes);
app.use("/kin", kinRoutes);

// Root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// SQL query runner
app.post("/query", async (req, res) => {
  try {
    const { query } = req.body;
    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ================= CSV UPLOAD API =================

// multer setup
const upload = multer({ dest: "uploads/" });

app.post("/upload-csv/:table", upload.single("file"), async (req, res) => {
  const table = req.params.table;
  const filePath = req.file.path;

  const rows = [];

  fs.createReadStream(filePath)
    .pipe(csv({ mapHeaders: ({ header }) => header.trim().replace(/^\uFEFF/, "") }))
    .on("data", (data) => rows.push(data))
    .on("end", async () => {
      try {
        if (rows.length === 0) {
          return res.status(400).json({ error: "CSV is empty" });
        }

        const columns = Object.keys(rows[0]);
        const values = rows.map(row => columns.map(col => row[col]));

        const sql = `
          INSERT INTO ${table} (${columns.join(",")})
          VALUES ?
        `;

        await pool.query(sql, [values]);

        fs.unlinkSync(filePath);

        res.json({
          message: `Inserted ${rows.length} rows into ${table}`
        });

      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});