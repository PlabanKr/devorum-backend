const express = require("express");
const router = express.Router();

// database connection pool
const pool = require("../../../database/postgres.database.js");

/*
  Any route defined in here will have a prefix of /api/v1/forum/joined/

  ORDER OF THE ROUTE IS IMPORTANT, ANY ROUTE THAT IS TAKING req.params MUST BE DECLARED AT LOWER THAN THE DECLARATION OF SIMILAR ROUTE.
  ELSE THE req.params ROUTE WILL RUN FIRST
*/

// Get everything
router.get("/", (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 10; // Default to 10 if not provided or invalid
    const page = parseInt(req.query.page, 10) || 1; // Default to 1 if not provided or invalid

    // Calculate offset, ensure it's non-negative
    const offset = Math.max((page - 1) * limit, 0);
    pool.query(
      "SELECT * FROM forum_joined LIMIT $1 OFFSET $2",
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

// Get forums joined by an user
// get forums by user_id (example: localhost:5000/api/v1/forum/joined/user/1 OR localhost:5000/api/v1/forum/joined/user/1?limit=1000&page=1)
router.get("/user/:id", (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 10; // Default to 10 if not provided or invalid
    const page = parseInt(req.query.page, 10) || 1; // Default to 1 if not provided or invalid

    // Calculate offset, ensure it's non-negative
    const offset = Math.max((page - 1) * limit, 0);
    const id = req.params.id;
    pool.query(
      "SELECT * FROM forum_joined WHERE user_id = $1 LIMIT $2 OFFSET $3",
      [id, limit, offset],
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

// Get users joined in a specific forum
// get users by forum_id (example: localhost:5000/api/v1/forum/joined/forum/1 OR localhost:5000/api/v1/forum/joined/forum/1?limit=1000&page=1)
router.get("/forum/:id", (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 10; // Default to 10 if not provided or invalid
    const page = parseInt(req.query.page, 10) || 1; // Default to 1 if not provided or invalid

    // Calculate offset, ensure it's non-negative
    const offset = Math.max((page - 1) * limit, 0);
    const id = req.params.id;
    pool.query(
      "SELECT * FROM forum_joined WHERE forum_id = $1 LIMIT $2 OFFSET $3",
      [id, limit, offset],
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


module.exports = router;

