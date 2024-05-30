const mongoose = require("mongoose");

const serverSchema = new mongoose.Schema({
  serverName: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  creationDate: { type: Date, default: Date.now },
  description: String,
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  Serverpic: { type: String },
});

const Server = mongoose.model("Server", serverSchema);
module.exports = Server;
