const mongoose = require("mongoose");

const creatorSchema = new mongoose.Schema(
  {
    gameId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "creator",
      required: true,
    },
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      minlength: 5,
      maxlength: 50,
      required: true,
      unique: true,
      validate: /@/,
    },
    password: {
      type: String,
      minlength: 5,
      maxlength: 25,
      required: true,
      validate: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).*$/,
    },
    logo: String,
    location: {
      type: String,
      minlength: 5,
      maxlength: 100,
    },
    spaceBuck: {
      type: Number,
      min: 0,
      max: 10000,
      required: true,
      default: 500,
      validate: {
        validator: Number.isInteger,
      },
    },
    game: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "game",
      },
    ],
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
  { collection: "creators", timestamps: true }
);

module.exports = mongoose.model("creator", creatorSchema);
