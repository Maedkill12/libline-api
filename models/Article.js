const mongoose = require("mongoose");

const ArticleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title must be provided"],
      minlength: 3,
      maxlength: 100,
    },
    author: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Author must be provided"],
    },
    year: {
      type: Number,
      max: new Date().getFullYear(),
      required: [true, "Year of publication must be provided"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Article", ArticleSchema);
