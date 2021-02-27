const User = require("../models/user");
const Game = require("../models/game");
const { deleteOne: deleteGame } = require("./game");
const Transaction = require("../models/transaction");
const { execController, skipNext } = require("../helpers/controller");

const findAll = () => execController(skipNext, Transaction.find().lean());

const findOne = (filter, data) =>
  execController(skipNext, Transaction.findOne(filter, data));

const create = (transaction) =>
  execController(
    async () => await Transaction.create(transaction),
    Transaction.findOne(transaction).populate("game").populate("user")
  );

const findOneAndUpdate = (filter, update) =>
  execController(async () => {
    const { done } = update.$set;
    const transaction = await Transaction.findOneAndUpdate(filter, update, {
      new: true,
      useFindAndModify: false,
    });
    if (done) {
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
      if (game.quantity === 0) deleteGame({ _id: transaction.game });
    }
  }, Transaction.findOne(filter));

const deleteOne = (filter) =>
  execController(skipNext, Transaction.deleteOne(filter));

module.exports = {
  findAll,
  findOne,
  create,
  findOneAndUpdate,
  deleteOne,
};
