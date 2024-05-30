const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  server: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Server",
    required: true,
  },
  categoryName: { type: String, required: true },
  creationDate: { type: Date, default: Date.now },
});

const Categories = mongoose.model("Category", categorySchema);
module.exports = Categories;
