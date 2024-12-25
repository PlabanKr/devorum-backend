require("dotenv").config();

const cors = require("cors");
const express = require("express");
const pool = require("./database/postgres.database.js");

// APP GLOBAL VARIABLE
const SERVER = express();
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";
const PORT = process.env.PORT || 8000;

// APP CONFIG
SERVER.use(express.json());
SERVER.use(cors({ origin: FRONTEND_ORIGIN, credentials: true }));

// ROUTES
const apiV1 = require("./routes/v1/api.v1.js");
SERVER.use("/api/v1/", apiV1);

SERVER.get("/", (req, res) => {
  res.send("⚡Server is running⚡");
});

// Test Database Connection
(async () => {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("Database Connection Successful:", result.rows[0]);
  } catch (error) {
    console.error("Database Connection Failed:", error);
  }
})();

// Start server on specified port
SERVER.listen(PORT, () => {
  console.log(`Server is running at port: ${PORT}`);
});
