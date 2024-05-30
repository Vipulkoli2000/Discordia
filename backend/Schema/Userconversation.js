const mongoose = require("mongoose");

const UserConversationSchema = new mongoose.Schema({
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", index: true }],
  lastMessageTimestamp: { type: Date, default: Date.now },
});

const UserConversation = mongoose.model(
  "UserConversation",
  UserConversationSchema
);
module.exports = UserConversation;
