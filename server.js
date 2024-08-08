require("dotenv").config();

const cors = require("cors");
const express = require("express");

// APP GLOBAL VARIABLE
const SERVER = express();
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:3000";
const PORT = process.env.PORT || 5000;

// APP CONFIG
SERVER.use(express.json());
SERVER.use(cors({ origin: FRONTEND_ORIGIN, credentials: true }));

// ROUTES
SERVER.get("/", (req, res) => {
  res.send("⚡Server is running⚡");
});

// Start server on specified port
SERVER.listen(PORT, () => {
  console.log(`Server is running at port: ${PORT}`);
});