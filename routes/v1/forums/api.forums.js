const express = require("express");
const router = express.Router();

// database connection pool
const pool = require("../../../database/postgres.database.js");

// Get all the forums
router.get("/", (req, res) => {
  try {
    // Parse the query parameters to integers, provide default values if not provided
    const limit = parseInt(req.query.limit, 10) || 10; // Default limit of 10 if not provided
    const page = parseInt(req.query.page, 10) || 1;    // Default page of 1 if not provided

    // Calculate offset, ensuring it's a number
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

// Search forums by title or other attributes
router.get("/search", (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 20; // Default to 20 if not provided or invalid
    const page = parseInt(req.query.page, 10) || 1;    // Default to 1 if not provided or invalid
    const offset = Math.max((page - 1) * limit, 0);   // Ensure offset is non-negative
    const { query } = req.query;                     // Extract the search query from the query parameters

    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }

    // Search forums by title, details, or other fields using ILIKE for case-insensitive matching
    pool.query(
      "SELECT * FROM forums WHERE title ILIKE $1 OR details ILIKE $1 LIMIT $2 OFFSET $3",
      [`%${query}%`, limit, offset],
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

router.get("/devorum/:devorum", (req, res) => {
  const devorum = req.params.devorum;
  pool.query(
    "SELECT * FROM forums WHERE devorum = $1",
    [devorum],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows[0]);
    }
  );
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
            "INSERT INTO forums (title, details, rules, devorum) VALUES ($1,$2,$3,$4) RETURNING *",
            [
              newForum.title,
              newForum.details,
              newForum.rules,
              newForum.devorum,
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
