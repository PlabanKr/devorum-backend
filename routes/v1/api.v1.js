const express = require("express");
const router = express.Router();

const userRoutes = require("./users/api.user.js");
const forumRoutes = require("./forums/api.forums.js");
const ideaRoutes = require("./ideas/api.idea.js");
const ideaInterestedRoutes = require("./interests/api.interest.js");

router.use("/user", userRoutes);
router.use("/forum", forumRoutes);
router.use("/idea", ideaRoutes);
router.use("/interest", ideaInterestedRoutes);

module.exports = router;