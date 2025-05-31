const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const multer = require("multer");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from "uploads" folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MySQL Connection
const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "hsamoomoo",
  password: "123456",
  database: "timesheet",
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error("MySQL connection failed:", err.message);
  } else {
    console.log("Connected to MySQL database!");
    connection.release();
  }
});

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage: storage });

// ========== Routes ==========

// 1. Attendance form insert
app.post("/attendancefunction", (req, res) => {
  const {
    name,
    gender,
    position,
    department,
    email,
    type,
    date,
    timeIn,
    timeOut,
    workingHours,
    startLeaveDay,
    endLeaveDay,
    totalLeaveDaysThisMonth,
    approvedBy,
  } = req.body;

  const sql = `
    INSERT INTO tbl_attendance (
      name, gender, position, department, email, type, date,
      timeIn, timeOut, workingHours,
      startLeaveDay, endLeaveDay, totalLeaveDaysThisMonth, approvedBy
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  pool.query(
    sql,
    [
      name,
      gender,
      position,
      department,
      email || null,
      type,
      date,
      timeIn,
      timeOut,
      workingHours || null,
      startLeaveDay || null,
      endLeaveDay || null,
      totalLeaveDaysThisMonth || null,
      approvedBy,
    ],
    (err, results) => {
      if (err) {
        console.error("Insert error:", err.message);
        return res.status(500).json({ error: "Database insert failed" });
      }
      res
        .status(200)
        .json({ message: "Insert successful", id: results.insertId });
    }
  );
});

// 2. Individual Timesheet insert
app.post("/individualfunction", (req, res) => {
  const {
    name,
    gender,
    position,
    department,
    email,
    type,
    date,
    timeIn,
    timeOut,
    workingHours,
    startLeaveDay,
    endLeaveDay,
    totalLeaveDaysThisMonth,
    activities,
    approvedBy,
  } = req.body;

  const sql = `
    INSERT INTO tbl_individual (
      name, gender, position, department, email, type, date,
      timeIn, timeOut, workingHours,
      startLeaveDay, endLeaveDay, totalLeaveDaysThisMonth, activities, approvedBy
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  pool.query(
    sql,
    [
      name,
      gender,
      position,
      department,
      email || null,
      type,
      date,
      timeIn,
      timeOut,
      workingHours || null,
      startLeaveDay || null,
      endLeaveDay || null,
      totalLeaveDaysThisMonth || null,
      activities || null,
      approvedBy,
    ],
    (err, results) => {
      if (err) {
        console.error("Insert error:", err.message);
        return res.status(500).json({ error: "Database insert failed" });
      }
      res
        .status(200)
        .json({ message: "Insert successful", id: results.insertId });
    }
  );
});

// 3. Staff Profile Insert with Image Upload
app.post("/staffdatabasefunction", upload.single("image"), (req, res) => {
  const { name, gender, position, departments, joinDate, staffCode, tags } =
    req.body;
  const image = req.file ? "/uploads/" + req.file.filename : null;

  const sql = `
    INSERT INTO tbl_staffprofile 
    (name, gender, position, image, departments, joinDate, staffCode, tags) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  pool.query(
    sql,
    [name, gender, position, image, departments, joinDate, staffCode, tags],
    (err, result) => {
      if (err) {
        console.error("Insert error:", err.message);
        return res.status(500).send("Failed to insert staff.");
      }
      res.status(200).send("Staff added successfully!");
    }
  );
});

// ✅ 4. Staff Profile Fetch (Fixed GET Route)
app.get("/api/staffdatabasefunction", (req, res) => {
  const sql = "SELECT * FROM tbl_staffprofile";

  pool.query(sql, (err, result) => {
    if (err) {
      console.error("Fetch error:", err.message);
      return res.status(500).send("Failed to fetch staff.");
    }

    // Optional: Parse tags if stored as JSON string
    const parsedResult = result.map((staff) => ({
      ...staff,
      tags:
        typeof staff.tags === "string" ? JSON.parse(staff.tags) : staff.tags,
    }));

    res.status(200).json(parsedResult);
  });
});

// ========== Start Server ==========
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
