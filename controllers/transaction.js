const User = require("../models/user");
const Game = require("../models/game");
const Transaction = require("../models/transaction");
const { execPromise } = require("../helpers/controller");

const findAll = () => execPromise(async () => await Transaction.find().lean());

const findOne = (filter, data) =>
  execPromise(async () => await Transaction.findOne(filter, data));

const create = (transaction) =>
  execPromise(async () => {
    await Transaction.create(transaction);
    return await Transaction.findOne(transaction)
      .populate("game")
      .populate("user");
  });

const findOneAndUpdate = (filter, update) =>
  execPromise(async () => {
    const { confirmed, done } = update;
    const transaction = await Transaction.findOneAndUpdate(
      filter,
      { $set: { ...update } },
      {
        new: true,
        useFindAndModify: false,
      }
    );
    const game = await Game.findOne({ _id: transaction.game });
    if (confirmed && done && game.transaction !== 0) {
      const game = await Game.findOneAndUpdate(
        { _id: transaction.game },
        { $inc: { quantity: -1 } },
        {
          new: true,
          useFindAndModify: false,
        }
      );
      await User.findOneAndUpdate(
        { _id: transaction.buyer },
        { $inc: { spaceBuck: -game.spaceBuck } },
        {
          new: true,
          useFindAndModify: false,
        }
      );
      await User.findOneAndUpdate(
        { _id: transaction.seller },
        { $inc: { spaceBuck: game.spaceBuck } },
        {
          new: true,
          useFindAndModify: false,
        }
      );
      return await Transaction.findOne(filter);
    } else {
      console.error("There is no more games to sell");
    }
  });

const deleteOne = (filter) =>
  execPromise(async () => await Transaction.deleteOne(filter));

module.exports = {
  findAll,
  findOne,
  create,
  findOneAndUpdate,
  deleteOne,
};
