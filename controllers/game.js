const User = require("../models/user");
const Game = require("../models/game");
const Comment = require("../models/comment");
const Transaction = require("../models/transaction");
const {
  execController,
  skipNext,
  uploadImage,
  deleteImage,
} = require("../helpers/controller");

const findAll = (limit = 0, offset = 0) =>
  execController(
    skipNext,
    Game.find().skip(parseInt(offset)).limit(parseInt(limit))
  );

const findOne = (filter, data) =>
  execController(skipNext, Game.findOne(filter, data));

const create = (game, file) =>
  execController(async () => {
    const image = file
      ? await uploadImage(file, "1GWaB-McnGh3L1L3ICQkC0ek7o7GMEHg0")
      : "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/480px-No_image_available.svg.png";
    await Game.create({ ...game, image });
    await User.findOneAndUpdate(
      { _id: game.user },
      {
        $push: {
          game: await Game.findOne(game, ["_id"]),
        },
      },
      { useFindAndModify: false }
    ).populate("game");
  }, Game.findOne(game).populate("user"));

const findOneAndUpdate = (filter, update) =>
  execController(
    skipNext,
    Game.findOneAndUpdate(filter, update, {
      new: true,
      useFindAndModify: false,
    })
  );

const deleteOne = (filter) =>
  execController(async () => {
    const { _id, user, image } = await Game.findOne(filter);
    await User.findOneAndUpdate(
      { _id: user },
      {
        $pull: {
          game: _id,
        },
      }
    );
    await Comment.deleteMany({ postedOn: "game", postedOnId: _id });
    await Transaction.deleteMany({ game: _id });
    if (
      image !==
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/480px-No_image_available.svg.png"
    )
      await deleteImage(image);
  }, Game.deleteOne(filter));

module.exports = {
  findAll,
  findOne,
  create,
  findOneAndUpdate,
  deleteOne,
};
