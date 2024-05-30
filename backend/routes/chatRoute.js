var express = require("express");
var router = express.Router();
const chatController = require("../controller/chatController");
const { isAuthenticated } = require("../Middlewares/Auth");
const {
  loadUserPermissions,
  hasPermission,
} = require("../Middlewares/Permissions");
// Post a new message in a channel, requires channel access
router.post(
  "/channels/:channelId/messages",
  isAuthenticated,
  chatController.createMessage
);

// Get messages for a channel, requires channel access
router.get("/:channelId", chatController.getChannelMessages);

// Update a message, requires message ownership or manage permission
router.put(
  "/channels/:channelId/messages/:messageId",
  isAuthenticated,
  loadUserPermissions,
  hasPermission("MANAGE_CHANNEL"),
  chatController.updateMessage
);

// Delete a message, requires message ownership or manage permission
// router.delete(
//   "/channels/:channelId/messages/:messageId",
//   isAuthenticated,
//   loadUserPermissions,
//   hasPermission("MANAGE_CHANNEL"),
//   chatController.deleteMessage
// );

module.exports = router;
