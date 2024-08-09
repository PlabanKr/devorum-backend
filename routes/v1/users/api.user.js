const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();

// database connection pool
const pool = require("../../../database/postgres.database.js");

// get user by id
router.get("/:id", (req, res) => {
  try {
    const id = req.params.id;
    pool.query(
      "SELECT * FROM users WHERE user_id = $1",
      [id],
      (error, results) => {
        if (error) {
          throw error;
        }
        res.status(200).json(results.rows);
      }
    );
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).send("Internal Server Error\n" + error);
  }
});

// get all users
router.get("/", (req, res) => {
  try {
    const limit = req.query.limit;
    const page = req.query.page;
    const offset = (page - 1) * limit;

    pool.query(
      "SELECT * FROM users LIMIT $1 OFFSET $2",
      [limit, offset],
      (error, results) => {
        if (error) {
          throw error;
        }
        res.status(200).json(results.rows);
      }
    );
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).send("Internal Server Error\n" + error);
  }
});

// create new user
router.post("/", async (req, res) => {
  try {
    const newUserRawData = req.body;
    const saltRounds = 5;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(newUserRawData.password, salt);
    const newUser = { ...newUserRawData, password: hashedPassword };
    pool.query(
      "SELECT * FROM users WHERE email=$1",
      [newUser.email],
      (error, results) => {
        if (error) {
          throw error;
        }
        if (results.rowCount > 0) {
          throw new Error("Email Already Exists");
        } else {
          pool.query(
            "INSERT INTO users (name, user_name, email, is_admin, profile_photo, hashed_password, bio, account_type) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *",
            [
              newUser.name || null,
              newUser.user_name,
              newUser.email,
              newUser.is_admin || false,
              newUser.profile_photo || null,
              newUser.password,
              newUser.bio || null,
              newUser.account_type || "basic"
            ],
            (error, results) => {
              if(error) {
                throw error;
              }
              const email = results.rows[0].email;
              const jwtToken = jwt.sign({email}, process.env.TOKEN_SECRET || 'secret', { expiresIn: "7d" });
              res.status(201).json({token: jwtToken, user: results.rows[0]});
            }
          );
        }
      }
    );
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).send("Internal Server Error\n" + error);
  }
});

module.exports = router;
