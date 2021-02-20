const { SHA256 } = require("crypto-js");

const User = require("../models/user");
const Game = require("../models/game");
const Comment = require("../models/comment");
const Transaction = require("../models/transaction");
const { execController, skipNext } = require("../helpers/controller");
const {
  uploadImage,
  generatePublicUrl,
  deleteImage,
} = require("../helpers/upload");

const findAll = () => execController(skipNext, User.find().lean());

const findOne = (filter, data) =>
  execController(skipNext, User.findOne(filter, data));

const create = (user, image) =>
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

const deleteOne = (filter) =>
  execController(async () => {
    const user = await User.findOne(filter);
    await Game.deleteMany({ user: user._id });
    await Comment.deleteMany({ postedBy: user._id });
    await Comment.deleteMany({ postedOn: "user", postedOnId: user._id });
    await Transaction.deleteMany({ buyer: user._id });
    await Transaction.deleteMany({ seller: user._id });
  }, User.deleteOne(filter));

module.exports = {
  findAll,
  findOne,
  create,
  findOneAndUpdate,
  deleteOne,
};
