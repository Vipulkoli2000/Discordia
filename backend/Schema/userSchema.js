// models/user.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  creationDate: { type: Date, default: Date.now },

  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  directMessages: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  pendingFriendRequests: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  ],
  blocked: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const User = mongoose.model("User", userSchema);
module.exports = User;
