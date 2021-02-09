const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    gameId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "game",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
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
      min: 0,
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

//For RAM and Storage the measurement unit is GB
module.exports = mongoose.model("comment", commentSchema);
