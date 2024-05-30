const mongoose = require("mongoose");

const Directmessagebothschema = new mongoose.Schema({
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", index: true }],
  lastMessageTimestamp: { type: Date, default: Date.now },
  Messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Directmessage" }],
});

const Directmesagesboth = mongoose.model(
  "Directmessageboth",
  Directmessagebothschema
);
module.exports = Directmesagesboth;
