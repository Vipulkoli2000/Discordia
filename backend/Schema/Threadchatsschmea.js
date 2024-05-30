const mongoose = require("mongoose");

const Threadschema = new mongoose.Schema({
  ThreadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Thread",
    required: true,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Threadchat = mongoose.model("Threadchat", Threadschema);
module.exports = Threadchat;
