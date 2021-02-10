const mongoose = require("mongoose");

const requirementsSchema = new mongoose.Schema(
  {
    gameId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "game",
      required: true,
    },
    cpu: {
      type: String,
      maxlength: 30,
      required: true,
    },
    gpu: {
      type: String,
      maxlength: 30,
      required: true,
    },
    ram: {
      type: Number,
      max: 64,
      required: true,
    },
    storage: {
      type: Number,
      max: 512,
      required: true,
    },
  },
  { collection: "requirements", timestamps: true }
);

//For RAM and Storage the measurement unit is GB
module.exports = mongoose.model("requirements", requirementsSchema);
