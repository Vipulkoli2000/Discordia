var express = require("express");
var router = express.Router();
const channelController = require("../controller/channelController");
const { isAuthenticated } = require("../Middlewares/Auth");
const {
  loadUserPermissions,
  hasPermission,
} = require("../Middlewares/Permissions");

router.get("/:serverId", channelController.getServerChannels);
router.get("/channelfind/:channelId", channelController.getChannel);
router.post(
  "/create/:serverId",

  channelController.createChannel
);
router.put(
  "/servers/:serverId/channels/:channelId",
  isAuthenticated,
  loadUserPermissions,
  hasPermission("MANAGE_CHANNEL"),
  channelController.updateChannel
);
router.delete(
  "/servers/:serverId/channels/:channelId",
  isAuthenticated,
  loadUserPermissions,
  hasPermission("MANAGE_CHANNEL"),
  channelController.deleteChannel
);

module.exports = router;
