const express = require("express");
const router = express.Router();

const userRoutes = require("./users/api.user.js");
const forumRoutes = require("./forums/api.forums.js");
const ideaRoutes = require("./ideas/api.idea.js");

router.use("/user", userRoutes);
router.use("/forum", forumRoutes);
router.use("/idea", ideaRoutes);

module.exports = router;