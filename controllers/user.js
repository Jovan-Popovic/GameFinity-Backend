const { SHA256 } = require("crypto-js");

const User = require("../models/user");
const { execController, skipNext } = require("../helpers");

const findAll = () => execController(skipNext, User.find().lean());

const findOne = (filter, data) =>
  execController(skipNext, User.findOne(filter, data));

const create = (user) =>
  execController(
    async () => await User.create(user),
    User.findOneAndUpdate(
      user,
      { $set: { password: SHA256(user.password) } },
      { new: true, useFindAndModify: false }
    )
  );

const findOneAndUpdate = (filter, update) =>
  execController(
    skipNext,
    User.findOneAndUpdate(
      filter,
      {
        ...update,
        password: SHA256(update.password),
      },
      { new: true, useFindAndModify: false }
    )
  );

const deleteOne = (filter) => execController(skipNext, User.deleteOne(filter));

module.exports = {
  findAll,
  findOne,
  create,
  findOneAndUpdate,
  deleteOne,
};
