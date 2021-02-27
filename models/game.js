const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: undefined,
    },
    creator: {
      type: String,
      minlength: 5,
      maxlength: 20,
      default: "Unknown",
    },
    name: {
      type: String,
      minlength: 3,
      maxlength: 50,
      required: true,
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
    image: {
      type: String,
      default:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/480px-No_image_available.svg.png",
    },
    state: {
      type: String,
      required: true,
      default: "new",
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

gameSchema.index({ name: 1 }, { unique: true });

module.exports = mongoose.model("game", gameSchema);
