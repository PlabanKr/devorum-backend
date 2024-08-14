const express = require("express");
const router = express.Router();

// database connection pool
const pool = require("../../../database/postgres.database.js");

// Get all the forums
router.get("/", (req, res) => {
  try {
    const limit = req.query.limit;
    const page = req.query.page;
    const offset = (page - 1) * limit;

    pool.query(
      "SELECT * FROM forums LIMIT $1 OFFSET $2",
      [limit, offset],
      (error, results) => {
        if (error) {
          throw error;
        }
        return res.status(200).json(results.rows);
      }
    );
  } catch (error) {
    console.log("Error: ", error);
    return res.status(500).send("Internal Server Error\n" + error);
  }
});

// Get a forum with particular id
router.get("/:id", (req, res) => {
  try {
    const id = req.params.id;
    pool.query(
      "SELECT * FROM forums WHERE forum_id = $1",
      [id],
      (error, results) => {
        if (error) {
          throw error;
        }
        return res.status(200).json(results.rows);
      }
    );
  } catch (error) {
    console.log("Error: ", error);
    return res.status(500).send("Internal Server Error\n" + error);
  }
});

// Create a forum
router.post("/", async (req, res) => {
  try {
    const newForum = req.body;
    pool.query(
      "SELECT * FROM forums WHERE title=$1",
      [newForum.title],
      (error, results) => {
        if (error) {
          throw error;
        }
        if (results.rowCount > 0) {
          return res.status(409).json({ message: "Forum title already exists" });
        } else {
          pool.query(
            "INSERT INTO forums (title, details, rules) VALUES ($1,$2,$3) RETURNING *",
            [
              newForum.title,
              newForum.details,
              newForum.rules,
            ],
            (error, results) => {
              if (error) {
                throw error;
              }
              return res
                .status(201)
                .json(results.rows[0]);
            }
          );
        }
      }
    );
  } catch (error) {
    console.log("Error: ", error);
    return res.status(500).send("Internal Server Error\n" + error);
  }
});


module.exports = router;
