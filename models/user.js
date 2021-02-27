const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      minlength: 5,
      maxlength: 20,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      maxlength: 50,
      required: true,
    },
    lastName: {
      type: String,
      maxlength: 50,
      required: true,
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
    profilePic: {
      type: String,
      default: "https://www.computerhope.com/jargon/g/guest-user.jpg",
    },
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
    role: {
      type: String,
      minlength: 4,
      maxlength: 7,
      default: "user",
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  { collection: "users", timestamps: true }
);

userSchema.index({ username: 1 }, { unique: true });

module.exports = mongoose.model("user", userSchema);
