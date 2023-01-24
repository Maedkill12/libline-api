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
    frontPageURL: {
      type: String,
      match: [/\.(jpe?g|png|gif|bmp|webp)$/i, "Please provide an Image URL"],
      required: false,
    },
    bannerURL: {
      type: String,
      match: [/\.(jpe?g|png|gif|bmp|webp)$/i, "Please provide an Image URL"],
      required: false,
    },
    docURL: {
      type: String,
      required: [true, "Proivde URL doc"],
      match: [/\.pdf$/i, "Please provide a valid doc"],
    },
    description: {
      type: String,
      required: [true, "Description must be provided"],
      maxlength: 200,
      minlength: 10,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Article", ArticleSchema);
