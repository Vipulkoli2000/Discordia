const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  channel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Channel",
  },
  ThreadId: { type: mongoose.Schema.Types.ObjectId, ref: "Thread" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Chat = mongoose.model("Chat", messageSchema);
module.exports = Chat;
