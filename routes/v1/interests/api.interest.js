const express = require("express");
const router = express.Router();

// database connection pool
const pool = require("../../../database/postgres.database.js");

/*
  Any route defined in here will have a prefix of /api/v1/interest/

  ORDER OF THE ROUTE IS IMPORTANT, ANY ROUTE THAT IS TAKING req.params MUST BE DECLARED AT LOWER THAN THE DECLARATION OF SIMILAR ROUTE.
  ELSE THE req.params ROUTE WILL RUN FIRST
*/


// Get all interests
router.get("/", (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 10; // Default to 10 if not provided or invalid
    const page = parseInt(req.query.page, 10) || 1; // Default to 1 if not provided or invalid

    // Calculate offset, ensure it's non-negative
    const offset = Math.max((page - 1) * limit, 0);

    pool.query(
      "SELECT * FROM idea_interested LIMIT $1 OFFSET $2",
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

// get interest by id (example: localhost:5000/api/v1/interest/id/1)
router.get("/id/:id", (req, res) => {
  try {
    const id = req.params.id;
    pool.query(
      "SELECT * FROM idea_interested WHERE interested_id = $1",
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

// get interest by user
router.get("/user_id/:id", (req, res) => {
  try {
    const id = req.params.id;
    pool.query(
      "SELECT * FROM idea_interested WHERE user_id = $1",
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

// get interests by idea
router.get("/idea_id/:id", (req, res) => {
  try {
    const id = req.params.id;
    pool.query(
      "SELECT * FROM idea_interested WHERE ideas_id = $1",
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

// Create an interest
router.post("/", async (req, res) => {
  try {
    const newInterest = req.body;
    pool.query(
      "SELECT * FROM idea_interested WHERE user_id=$1 AND ideas_id=$2",
      [newInterest.user_id, newInterest.idea_id],
      (error, results) => {
        if (error) {
          throw error;
        }
        if (results.rowCount > 0) {
          return res.status(409).json({ message: "Cannot interest an idea twice." });
        } else {
          pool.query(
            "INSERT INTO idea_interested (user_id, ideas_id) VALUES ($1,$2) RETURNING *",
            [newInterest.user_id, newInterest.idea_id],
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

// delete idea interested using user_id and idea_id
router.delete("/", (req, res) => {
  try {
    const {user_id, idea_id} = req.body;
    pool.query("SELECT * FROM idea_interested WHERE ideas_id = $1 AND user_id = $2", [idea_id, user_id], (error, results) => {
      if (error) {
        throw error;
      }
      if (results.rowCount > 0) {
        pool.query("DELETE FROM idea_interested WHERE ideas_id = $1;", [idea_id], (error) => {
          if (error) {
            throw error;
          }
          return res
            .status(202)
            .json({ message: "Idea deleted successfully", data: { idea_id: idea_id } });
        });
      } else {
        return res.status(404).json({ message: "Interest does not exist" });
      }
    });
  } catch (error) {
    console.log("Error: ", error);
    return res.status(500).send("Internal Server Error\n" + error);
  }
});

// delete idea interested using idea_id
router.delete("/idea/:id", (req, res) => {
  try {
    const idea_id = req.params.id;
    pool.query("SELECT * FROM idea_interested WHERE ideas_id = $1", [idea_id], (error, results) => {
      if (error) {
        throw error;
      }
      if (results.rowCount > 0) {
        pool.query("DELETE FROM idea_interested WHERE ideas_id = $1;", [idea_id], (error) => {
          if (error) {
            throw error;
          }
          return res
            .status(202)
            .json({ message: "Idea deleted successfully", data: { idea_id: idea_id } });
        });
      } else {
        return res.status(404).json({ message: "Interest does not exist" });
      }
    });
  } catch (error) {
    console.log("Error: ", error);
    return res.status(500).send("Internal Server Error\n" + error);
  }
});

module.exports = router;

