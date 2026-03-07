import express from "express";
import cors from "cors";
import studentsRoutes from "./routes/students.js";
import leasesRoutes from "./routes/leases.js";
import invoicesRoutes from "./routes/invoices.js";
import pool from "./db.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/students", studentsRoutes);
app.use("/leases", leasesRoutes);
app.use("/invoices", invoicesRoutes);

app.get("/", (req, res) => {
  res.send("University Accommodation Office API is running...");
});

app.get("/query", async (req, res) => {
  try {
    const { query } = req.body;
    const [rows] = await pool.query(`${query}`);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
