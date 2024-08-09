const express = require("express");
const router = express.Router();

const userRoutes = require("./users/api.user.js");

router.use("/user", userRoutes);

export default express;