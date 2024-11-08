const express = require("express");
const router = express.Router();

// database connection pool
const pool = require("../../../database/postgres.database.js");

/*
  Any route defined in here will have a prefix of /api/v1/connection/

  ORDER OF THE ROUTE IS IMPORTANT, ANY ROUTE THAT IS TAKING req.params MUST BE DECLARED AT LOWER THAN THE DECLARATION OF SIMILAR ROUTE.
  ELSE THE req.params ROUTE WILL RUN FIRST
*/

// Get all connections
router.get("/", (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 20; // Default to 10 if not provided or invalid
    const page = parseInt(req.query.page, 10) || 1; // Default to 1 if not provided or invalid

    // Calculate offset, ensure it's non-negative
    const offset = Math.max((page - 1) * limit, 0);

    pool.query(
      "SELECT * FROM connections LIMIT $1 OFFSET $2",
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

// get connection by connection id (example: localhost:5000/api/v1/connection/id/1)
router.get("/id/:id", (req, res) => {
  try {
    const id = req.params.id;
    pool.query(
      "SELECT * FROM connections WHERE connection_id = $1",
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

// get connections by sender id (example: localhost:5000/api/v1/connection/sender/1)
router.get("/sender/:id", (req, res) => {
  try {
    const id = req.params.id;
    pool.query(
      "SELECT * FROM connections WHERE sender_id = $1",
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

// get connections by receiver id (example: localhost:5000/api/v1/connection/receiver/1)
router.get("/receiver/:id", (req, res) => {
  try {
    const id = req.params.id;
    pool.query(
      "SELECT * FROM connections WHERE receiver_id = $1",
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

// get pending connections by receiver id (example: localhost:5000/api/v1/connection/pending/receiver/1)
// receiver can see which connections are pending
router.get("/pending/receiver/:id", (req, res) => {
  try {
    const id = req.params.id;
    pool.query(
      "SELECT * FROM connections WHERE receiver_id = $1 AND accepted = false",
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

// receiver can see which connections are pending
router.get("/connected/:id", (req, res) => {
  try {
    const id = req.params.id;
    pool.query(
      "SELECT * FROM connections WHERE (receiver_id = $1 OR sender_id = $1) AND accepted = true",
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

// create new connection (example: localhost:5000/api/v1/connection)
router.post("/", (req, res) => {
  try {
    const { sender_id, receiver_id } = req.body;
    // Check if the connection already exists
    pool.query(
      "SELECT * FROM connections WHERE sender_id = $1 AND receiver_id = $2",
      [sender_id, receiver_id],
      (error, results) => {
        if (error) {
          throw error;
        }
        if (results.rows.length > 0) {
          return res.status(400).send("Connection already exists");
        }

        // Proceed to insert the new connection
        pool.query(
          "INSERT INTO connections (sender_id, receiver_id) VALUES ($1, $2)",
          [sender_id, receiver_id],
          (error, results) => {
            if (error) {
              throw error;
            }
            return res.status(201).send("Connection request sent successfully");
          }
        );
      }
    );
  } catch (error) {
    console.log("Error: ", error);
    return res.status(500).send("Internal Server Error\n" + error);
  }
});

// accept connection by sender id (example: localhost:5000/api/v1/connection/accept/1)
router.put("/accept/:id", (req, res) => {
  try {
    const id = req.params.id;
    pool.query(
      "UPDATE connections SET accepted = true WHERE sender_id = $1",
      [id],
      (error, results) => {
        if (error) {
          throw error;
        }
        return res.status(200).send("Connection request accepted successfully");
      }
    );
  } catch (error) {
    console.log("Error: ", error);
    return res.status(500).send("Internal Server Error\n" + error);
  }
});

// accept connection by connection id (example: localhost:5000/api/v1/connection/accept/connection/1)
router.put("/accept/connection/:id", (req, res) => {
  try {
    const id = req.params.id;
    pool.query(
      "UPDATE connections SET accepted = true WHERE connection_id = $1",
      [id],
      (error, results) => {
        if (error) {
          throw error;
        }
        return res.status(200).send("Connection request accepted successfully");
      }
    );
  } catch (error) {
    console.log("Error: ", error);
    return res.status(500).send("Internal Server Error\n" + error);
  }
});

// delete connection by connection id (example: localhost:5000/api/v1/connection/1)
router.delete("/:id", (req, res) => {
  try {
    const id = req.params.id;
    pool.query(
      "DELETE FROM connections WHERE connection_id = $1",
      [id],
      (error, results) => {
        if (error) {
          throw error;
        }
        return res.status(200).send("Connection deleted successfully");
      }
    );
  } catch (error) {
    console.log("Error: ", error);
    return res.status(500).send("Internal Server Error\n" + error);
  }
});


module.exports = router;