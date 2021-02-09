const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: "Owned by creator",
    },
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "creator",
      required: true,
    },
    requirementsId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "requirements",
      required: true,
    },
    name: {
      type: String,
      minlength: 3,
      maxlength: 50,
      required: true,
      unique: true,
    },
    version: {
      type: String,
      validate: /./,
    },
    genre: [
      {
        type: String,
        required: true,
      },
    ],
    consoleType: [
      {
        type: String,
        maxlength: 20,
        required: true,
      },
    ],
    image: String,
    state: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      min: 0,
      required: true,
      default: 1,
    },
    description: {
      type: String,
      minlength: 10,
      maxlength: 300,
    },
    spaceBuck: {
      type: Number,
      min: 1,
      max: 300,
      required: true,
      default: 1,
      validate: {
        validator: Number.isInteger,
      },
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
  { collection: "games", timestamps: true }
);

userSchema.index({ name: 1 }, { unique: true });

module.exports = mongoose.model("game", gameSchema);
