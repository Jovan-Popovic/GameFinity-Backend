const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    gameId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "game",
      required: true,
    },
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    sellerId: {
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
