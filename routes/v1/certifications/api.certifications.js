const express = require("express");
const router = express.Router();

// database connection pool
const pool = require("../../../database/postgres.database.js");

// Get all certifications for a particular user_id
router.get("/:user_id", (req, res) => {
    try {
      const userId = req.params.user_id;
      pool.query(
        "SELECT * FROM certifications WHERE user_id = $1",
        [userId],
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

// Add a certification
router.post("/", (req, res) => {
    try {
      const { title, link, user_id } = req.body;
      pool.query(
        "INSERT INTO certifications (title, link, user_id) VALUES ($1, $2, $3) RETURNING *",
        [title, link, user_id],
        (error, results) => {
          if (error) {
            throw error;
          }
          return res.status(201).json(results.rows[0]);
        }
      );
    } catch (error) {
      console.log("Error: ", error);
      return res.status(500).send("Internal Server Error\n" + error);
    }
  });

// Delete a certification
router.delete("/", (req, res) => {
    try {
      const { certification_id } = req.body;
      pool.query(
        "DELETE FROM certifications WHERE certification_id = $1 RETURNING *",
        [certification_id],
        (error, results) => {
          if (error) {
            throw error;
          }
          if (results.rowCount === 0) {
            return res.status(404).send("Certification not found");
          }
          return res.status(200).json({ message: "Certification deleted successfully", deleted: results.rows[0] });
        }
      );
    } catch (error) {
      console.log("Error: ", error);
      return res.status(500).send("Internal Server Error\n" + error);
    }
  });

// Update a certification's title and link
router.put("/", (req, res) => {
  try {
      const { certification_id, newTitle, newLink, user_id } = req.body;

      // Validate input
      if (!certification_id || !newTitle || !newLink || !user_id) {
          return res.status(400).send("Missing required fields: certification_id, newTitle, or newLink");
      }

      pool.query(
          "UPDATE certifications SET title = $2, link = $3, user_id = $4 WHERE certification_id = $1 RETURNING *",
          [certification_id, newTitle, newLink, user_id],
          (error, results) => {
              if (error) {
                  throw error;
              }
              if (results.rowCount === 0) {
                  return res.status(404).send("Certification not found");
              }
              return res.status(200).json({ 
                  message: "Certification updated successfully", 
                  updated: results.rows[0] 
              });
          }
      );
  } catch (error) {
      console.log("Error: ", error);
      return res.status(500).send("Internal Server Error\n" + error);
  }
});
  

module.exports = router;
