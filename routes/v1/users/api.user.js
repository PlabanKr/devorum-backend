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
        return res.status(200).json(results.rows);
      }
    );
  } catch (error) {
    console.log("Error: ", error);
    return res.status(500).send("Internal Server Error\n" + error);
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
        return res.status(200).json(results.rows);
      }
    );
  } catch (error) {
    console.log("Error: ", error);
    return res.status(500).send("Internal Server Error\n" + error);
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
          return res.status(409).json({ message: "Email already exists" });
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
              newUser.account_type || "basic",
            ],
            (error, results) => {
              if (error) {
                throw error;
              }
              const email = results.rows[0].email;
              const jwtToken = jwt.sign(
                { email },
                process.env.TOKEN_SECRET || "secret",
                { expiresIn: "7d" }
              );
              return res.status(201).json({ token: jwtToken, user: results.rows[0] });
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

// user login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email],
      async (error, results) => {
        if (error) {
          throw error;
        }
        if (results.rows.length === 0) {
          return res.status(400).send("Email or Password is wrong");
        }
        const user = results.rows[0];
        const validPassword = await bcrypt.compare(
          password,
          user.hashed_password
        );
        if (!validPassword) {
          return res.status(400).send("Email or Password is wrong");
        }
        const token = jwt.sign(
          { email: user.email },
          process.env.TOKEN_SECRET || "secret",
          { expiresIn: "7d" }
        );
        return res.status(200).json({ token: token, user: user });
      }
    );
  } catch (error) {
    console.log("Error: ", error);
    return res.status(500).send("Internal Server Error\n" + error);
  }
});

// user update
router.put('/', (req, res) => {
  try {
      const { email, update } = req.body;
      if(!req.body) {
          // TODO: implement body not found error in other routes
          return res.status(400).send('No query parameters provided');
      }
      pool.query(`SELECT user_id FROM users WHERE email = $1`, [email], (error, results) => {
          if(error) {
              throw error;
          }
          const id = results.rows[0].user_id;
          pool.query(
              `UPDATE users
              SET ${Object.keys(update).map((key, index) => `${key} = $${index + 1}`).join(", ")}
              WHERE user_id = $${Object.keys(update).length + 1};`
              , [...Object.values(update), id], (error) => {
                  if(error) {
                      throw error;
                  }
                  pool.query(
                      `SELECT * FROM users WHERE user_id = $1`, [id], (error, selectResults) => {
                      if(error) {
                          throw error;
                      }
                      return res.status(201).json({ message: "User updated successfully",data: selectResults.rows[0] });
                  });
              });
      });
  } catch (error) {
      console.log('Error: ', error);
      return res.status(500).send('Internal Server Error\n' + error);
  }
});

//user delete
// TODO: implement admin authorization
router.delete('/', (req, res) => {
  try {
      const { email } = req.body;
      if(!req.body) {
          return res.status(400).send('No query parameters provided');
      }
      pool.query(`SELECT user_id FROM users WHERE email = $1`, [email], (error, results) => {
          if(error) {
              throw error;
          }
          const id = results.rows[0].user_id;
          pool.query(
              `DELETE FROM users WHERE user_id = $1;`
              , [id], (error) => {
                  if(error) {
                      throw error;
                  }
                  return res.status(201).json({ message: "User deleted successfully",data: {id: id} });
              });
      });
  } catch (error) {
      console.log('Error: ', error);
      return res.status(500).send('Internal Server Error\n' + error);
  }
});


module.exports = router;
