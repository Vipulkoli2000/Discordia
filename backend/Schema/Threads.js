const mongoose = require("mongoose");

const threadSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  channelID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Channel",
    required: true,
  },
  members: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
    default: function () {
      return [this.creator];
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Thread = mongoose.model("Thread", threadSchema);

module.exports = Thread;
