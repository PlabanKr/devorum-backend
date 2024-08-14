const express = require("express");
const router = express.Router();

const userRoutes = require("./users/api.user.js");
const forumRoutes = require("./forums/api.forums.js");

router.use("/user", userRoutes);
router.use("/forum", forumRoutes);

module.exports = router;