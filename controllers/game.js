const User = require("../models/user");
const Game = require("../models/game");
const { execController, skipNext } = require("../helpers");

const findAll = (limit = 0, offset = 0) =>
  execController(
    skipNext,
    Game.find().skip(parseInt(offset)).limit(parseInt(limit))
  );

const findOne = (filter) => execController(skipNext, Game.findOne(filter));
//Requests below are not finished
const create = (game) =>
  execController(async () => {
    await Game.create(game);
    await User.findOneAndUpdate(
      { _id: game.user },
      {
        $push: {
          product: await Product.findOne(game, ["_id"]),
        },
      }
    )
      .populate("product")
      .exec();
  }, Game.findOne(game).populate("user").exec());

const findOneAndUpdate = (filter, update) =>
  execController(
    skipNext,
    Game.findOneAndUpdate(filter, update, {
      upsert: true,
      new: true,
      useFindAndModify: false,
    })
  );

const deleteOne = (filter) => execController(skipNext, Game.deleteOne(Filter));

module.exports = {
  findAll,
  findOne,
  create,
  findOneAndUpdate,
  deleteOne,
};
