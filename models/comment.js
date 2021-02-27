const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    postedOn: String,
    postedOnId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "postedOn",
      required: true,
    },
    body: {
      type: String,
      minlength: 10,
      maxlength: 300,
      required: true,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 10,
      default: 0,
      required: true,
      validate: {
        validator: Number.isInteger,
      },
    },
  },
  { collection: "comments", timestamps: true }
);

module.exports = mongoose.model("comment", commentSchema);
