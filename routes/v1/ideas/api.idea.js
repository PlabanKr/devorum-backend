const express = require("express");
const router = express.Router();

// database connection pool
const pool = require("../../../database/postgres.database.js");

/*
  Any route defined in here will have a prefix of /api/v1/idea/

  ORDER OF THE ROUTE IS IMPORTANT, ANY ROUTE THAT IS TAKING req.params MUST BE DECLARED AT LOWER THAN THE DECLARATION OF SIMILAR ROUTE.
  ELSE THE req.params ROUTE WILL RUN FIRST
*/

// Get all ideas
router.get("/", (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 20; // Default to 10 if not provided or invalid
    const page = parseInt(req.query.page, 10) || 1; // Default to 1 if not provided or invalid

    // Calculate offset, ensure it's non-negative
    const offset = Math.max((page - 1) * limit, 0);

    pool.query(
      "SELECT * FROM ideas LIMIT $1 OFFSET $2",
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

// Get all recent ideas
router.get("/recent", (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 20) || 20; // Default to 10 if not provided or invalid
    const page = parseInt(req.query.page, 10) || 1; // Default to 1 if not provided or invalid

    // Calculate offset, ensure it's non-negative
    const offset = Math.max((page - 1) * limit, 0);

    pool.query(
      "SELECT * FROM ideas ORDER BY created_at DESC LIMIT $1 OFFSET $2",
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

// get idea by id (example: localhost:5000/api/v1/idea/id/1)
router.get("/id/:id", (req, res) => {
  try {
    const id = req.params.id;
    pool.query(
      "SELECT * FROM ideas WHERE idea_id = $1",
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

// get idea by user_id (example: localhost:5000/api/v1/idea/user/1 OR localhost:5000/api/v1/idea/user/1?limit=1000&page=1)
router.get("/user/:id", (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 10; // Default to 10 if not provided or invalid
    const page = parseInt(req.query.page, 10) || 1; // Default to 1 if not provided or invalid

    // Calculate offset, ensure it's non-negative
    const offset = Math.max((page - 1) * limit, 0);
    const id = req.params.id;
    pool.query(
      "SELECT * FROM ideas WHERE user_id = $1 LIMIT $2 OFFSET $3",
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

// get recent ideas by user_id (example: localhost:5000/api/v1/idea/user/1/recent OR localhost:5000/api/v1/idea/user/1/recent?limit=1000&page=1)
router.get("/user/:id/recent", (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 20) || 20; // Default to 20 if not provided or invalid
    const page = parseInt(req.query.page, 10) || 1; // Default to 1 if not provided or invalid

    // Calculate offset, ensure it's non-negative
    const offset = Math.max((page - 1) * limit, 0);
    const id = req.params.id;
    pool.query(
      "SELECT * FROM ideas WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3",
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

// get idea by forum_id (example: localhost:5000/api/v1/idea/forum/1 OR localhost:5000/api/v1/idea/forum/1?limit=1000&page=1)
router.get("/forum/:id", (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 20; // Default to 10 if not provided or invalid
    const page = parseInt(req.query.page, 10) || 1; // Default to 1 if not provided or invalid
    // Calculate offset, ensure it's non-negative
    const offset = Math.max((page - 1) * limit, 0);
    const id = req.params.id;
    pool.query(
      "SELECT * FROM ideas WHERE forum_id = $1 LIMIT $2 OFFSET $3",
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

// search idea (example: localhost:5000/api/v1/idea/search?query=gamedev)
router.get("/search", (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 20; // Default to 10 if not provided or invalid
    const page = parseInt(req.query.page, 10) || 1; // Default to 1 if not provided or invalid
    // Calculate offset, ensure it's non-negative
    const offset = Math.max((page - 1) * limit, 0);
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }

    pool.query(
      "SELECT * FROM ideas WHERE title ILIKE $1 OR body ILIKE $1 LIMIT $2 OFFSET $3",
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

// create idea
router.post("/", (req, res) => {
  try {
    const newIdea = req.body;
    pool.query(
      "INSERT INTO ideas (title, body, user_id, forum_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [
        newIdea.title, 
        newIdea.body, 
        Number(newIdea.user_id), 
        Number(newIdea.forum_id)
      ],
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

// update idea (You need to pass id as req.param and the updated contents in the req.body)
// This route can be used in general update of idea, changing the status of idea and many more
router.put("/id/:id", (req, res) => {
  try {
    if (!req.body) {
      // TODO: implement body not found error in other routes
      return res.status(400).send("No query parameters provided");
    }
    const {id} = req.params;
    const updatedIdea = req.body;
    pool.query(
      `UPDATE ideas
          SET ${Object.keys(updatedIdea)
            .map((key, index) => `${key} = $${index + 1}`)
            .join(", ")}
          WHERE idea_id = $${Object.keys(update).length + 1};`,
      [...Object.values(updatedIdea), id],
      (error) => {
        if (error) {
          throw error;
        }
        pool.query(
          `SELECT * FROM ideas WHERE idea_id = $1`,
          [id],
          (error, selectResults) => {
            if (error) {
              throw error;
            }
            return res
              .status(201)
              .json({
                message: "Idea updated successfully",
                data: selectResults.rows[0],
              });
          }
        );
      }
    );
  } catch (error) {
    console.log("Error: ", error);
    return res.status(500).send("Internal Server Error\n" + error);
  }
});


// delete idea
router.delete("/id/:id", (req, res) => {
  try {
    const {id} = req.params;
    pool.query("SELECT * FROM ideas WHERE idea_id = $1", [id], (error, results) => {
      if (error) {
        throw error;
      }
      if (results.rowCount > 0) {
        pool.query("DELETE FROM ideas WHERE idea_id = $1;", [id], (error) => {
          if (error) {
            throw error;
          }
          return res
            .status(202)
            .json({ message: "Idea deleted successfully", data: { id: id } });
        });
      } else {
        return res.status(404).json({ message: "Idea does not exist" });
      }
    });
  } catch (error) {
    console.log("Error: ", error);
    return res.status(500).send("Internal Server Error\n" + error);
  }
});

module.exports = router;
