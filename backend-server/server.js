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
const DEFAULT_PORT = Number(process.env.PORT) || 5000;

// __dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

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
const allowedTables = new Set([
  "Students",
  "Advisers",
  "Courses",
  "Residence_Staff",
  "Halls",
  "Hall_Rooms",
  "Apartments",
  "Apartment_Rooms",
  "Leases",
  "Invoices",
  "Apartment_Inspections",
  "Next_of_Kin",
]);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const safeName = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    cb(null, safeName);
  },
});

const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    const isCsvMime = [
      "text/csv",
      "application/csv",
      "application/vnd.ms-excel",
      "text/plain",
    ].includes(file.mimetype);
    const hasCsvExtension = path.extname(file.originalname).toLowerCase() === ".csv";

    if (isCsvMime || hasCsvExtension) {
      cb(null, true);
      return;
    }

    cb(new Error("Only CSV files are allowed"));
  },
});

const removeFileIfExists = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

app.post("/upload-csv/:table", upload.single("file"), async (req, res) => {
  const table = req.params.table;
  const filePath = req.file?.path;

  if (!allowedTables.has(table)) {
    removeFileIfExists(filePath);
    return res.status(400).json({ error: `Unsupported table: ${table}` });
  }

  if (!req.file) {
    return res.status(400).json({ error: "CSV file is required" });
  }

  const rows = [];

  fs.createReadStream(filePath)
    .pipe(csv({ mapHeaders: ({ header }) => header.trim().replace(/^\uFEFF/, "") }))
    .on("data", (data) => rows.push(data))
    .on("error", (err) => {
      removeFileIfExists(filePath);
      res.status(400).json({ error: `Failed to parse CSV: ${err.message}` });
    })
    .on("end", async () => {
      try {
        if (rows.length === 0) {
          removeFileIfExists(filePath);
          return res.status(400).json({ error: "CSV is empty" });
        }

        const columns = Object.keys(rows[0]);

        if (columns.length === 0) {
          removeFileIfExists(filePath);
          return res.status(400).json({ error: "CSV must include a header row" });
        }

        const [tableColumns] = await pool.query(`SHOW COLUMNS FROM \`${table}\``);
        const validColumns = new Set(tableColumns.map((column) => column.Field));
        const invalidColumns = columns.filter((column) => !validColumns.has(column));

        if (invalidColumns.length > 0) {
          removeFileIfExists(filePath);
          return res.status(400).json({
            error: `CSV contains invalid columns for ${table}: ${invalidColumns.join(", ")}`,
          });
        }

        const values = rows.map(row => columns.map(col => row[col]));

        const sql = `
          INSERT INTO \`${table}\` (${columns.map((column) => `\`${column}\``).join(",")})
          VALUES ?
        `;

        await pool.query(sql, [values]);

        removeFileIfExists(filePath);

        res.json({
          message: `Inserted ${rows.length} rows into ${table}`
        });

      } catch (err) {
        removeFileIfExists(filePath);
        res.status(500).json({ error: err.message });
      }
    });
});

app.use((err, _req, res, _next) => {
  if (err instanceof multer.MulterError || err.message === "Only CSV files are allowed") {
    return res.status(400).json({ error: err.message });
  }

  return res.status(500).json({ error: err.message || "Unexpected server error" });
});

const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      const fallbackPort = port + 1;
      console.warn(`Port ${port} is already in use. Retrying on port ${fallbackPort}...`);
      startServer(fallbackPort);
      return;
    }

    throw err;
  });
};

startServer(DEFAULT_PORT);
