const Transaction = require("../models/transaction");
const { execController, skipNext } = require("../helpers/controller");

const findAll = () => execController(skipNext, Transaction.find().lean());

const findOne = (filter, data) =>
  execController(skipNext, Transaction.findOne(filter, data));

const create = (transaction) =>
  execController(
    async () => await Transaction.create(transaction),
    Transaction.findOne(transaction).populate("user")
  );

const findOneAndUpdate = (filter, update) =>
  execController(
    skipNext,
    Transaction.findOneAndUpdate(filter, update, {
      new: true,
      useFindAndModify: false,
    })
  );

const deleteOne = (filter) =>
  execController(skipNext, Transaction.deleteOne(filter));

module.exports = {
  findAll,
  findOne,
  create,
  findOneAndUpdate,
  deleteOne,
};
