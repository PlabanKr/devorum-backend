const express = require("express");
const router = express.Router();

const userRoutes = require("./users/api.user.js");
const forumRoutes = require("./forums/api.forums.js");
const ideaRoutes = require("./ideas/api.idea.js");
const ideaInterestedRoutes = require("./interests/api.interest.js");
const forumJoinedRoutes = require("./forums_joined/api.forums.joined.js");
const connectionsRoutes = require("./connections/api.connections.js");

router.use("/user", userRoutes);
router.use("/forum", forumRoutes);
router.use("/idea", ideaRoutes);
router.use("/interest", ideaInterestedRoutes);
router.use("/forum-joined", forumJoinedRoutes);
router.use("/connection", connectionsRoutes);

module.exports = router;