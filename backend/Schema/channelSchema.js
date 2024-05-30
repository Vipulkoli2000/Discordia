const mongoose = require("mongoose");

// Define text channel schema
const channelSchema = new mongoose.Schema({
  server: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Server",
    required: true,
  },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" }, // Optional, channels might not belong to a category
  channelName: { type: String, required: true },
  channelType: { type: String, enum: ["text", "voice"], required: true },
  creationDate: { type: Date, default: Date.now },
  threads: [{ type: mongoose.Schema.Types.ObjectId, ref: "Thread" }], // Optional, channels might not have threads
  index: { type: Number },
});

// Define mongoose model for category
const Channel = mongoose.model("Channel", channelSchema);

module.exports = Channel;
