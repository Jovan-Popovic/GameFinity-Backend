const { SHA256 } = require("crypto-js");

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

const findAll = () => execController(skipNext, User.find().lean());

const findOne = (filter, data) =>
  execController(skipNext, User.findOne(filter, data));

const create = (user, file) =>
  execController(async () => {
    const profilePic = await uploadImage(
      file,
      "12_uStN3tcRRPbpwph3_qqfowUY5ndwxm"
    );
    console.log(profilePic);
    await User.create({ ...user, profilePic });
  }, User.findOneAndUpdate(user, { $set: { password: SHA256(user.password) } }, { new: true, useFindAndModify: false }));

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
    const { _id, profilePic } = await User.findOne(filter);
    await Game.deleteMany({ user: _id });
    await Comment.deleteMany({ postedBy: _id });
    await Comment.deleteMany({ postedOn: "user", postedOnId: _id });
    await Transaction.deleteMany({ buyer: _id });
    await Transaction.deleteMany({ seller: _id });
    if (profilePic !== "https://www.computerhope.com/jargon/g/guest-user.jpg")
      await deleteImage(profilePic);
  }, User.deleteOne(filter));

module.exports = {
  findAll,
  findOne,
  create,
  findOneAndUpdate,
  deleteOne,
};
