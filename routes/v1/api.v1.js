const express = require("express");
const router = express.Router();

const userRoutes = require("./users/api.user.js");
const forumRoutes = require("./forums/api.forums.js");
const ideaRoutes = require("./ideas/api.idea.js");
const ideaInterestedRoutes = require("./interests/api.interest.js");
const forumJoinedRoutes = require("./forums_joined/api.forums.joined.js");

router.use("/user", userRoutes);
router.use("/forum", forumRoutes);
router.use("/idea", ideaRoutes);
router.use("/interest", ideaInterestedRoutes);
router.use("/forum-joined", forumJoinedRoutes);

module.exports = router;