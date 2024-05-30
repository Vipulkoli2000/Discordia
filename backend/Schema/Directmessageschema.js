const mongoose = require("mongoose");

const Directmesageschema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  reciever: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Directmessage = mongoose.model("Directmessage", Directmesageschema);
module.exports = Directmessage;
