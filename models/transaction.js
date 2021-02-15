const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    game: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "game",
      required: true,
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    confirmed: {
      type: Boolean,
      required: true,
    },
    done: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { collection: "transactions", timestamps: true }
);

module.exports = mongoose.model("transaction", transactionSchema);
