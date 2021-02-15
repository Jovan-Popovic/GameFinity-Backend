const User = require("../models/user");
const Game = require("../models/game");
const { execController, skipNext } = require("../helpers");

const findAll = (limit = 0, offset = 0) =>
  execController(
    skipNext,
    Game.find().skip(parseInt(offset)).limit(parseInt(limit))
  );

const findOne = (filter) => execController(skipNext, Game.findOne(filter));

const create = (game) =>
  execController(async () => {
    await Game.create(game);
    await User.findOneAndUpdate(
      { _id: game.user },
      {
        $push: {
          game: await Game.findOne(game, ["_id"]),
        },
      },
      { useFindAndModify: false }
    ).populate("game");
  }, Game.findOne(game).populate("user").populate("creator"));

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
    const { user, _id } = await Game.findOne(filter, ["user", "_id"]);
    await User.findOneAndUpdate(
      { _id: user },
      {
        $pull: {
          game: _id,
        },
      }
    );
  }, Game.deleteOne(filter));

module.exports = {
  findAll,
  findOne,
  create,
  findOneAndUpdate,
  deleteOne,
};
