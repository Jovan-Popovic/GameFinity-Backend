const CryptoJS = require("crypto-js");

const User = require("../models/user");
const Game = require("../models/game");
const Comment = require("../models/comment");
const Transaction = require("../models/transaction");
const {
  execPromise,
  uploadImage,
  updateImage,
  deleteImage,
  defaultPic,
} = require("../helpers/controller");

const usersFolder = "12_uStN3tcRRPbpwph3_qqfowUY5ndwxm";

const findAll = (filter = {}) =>
  execPromise(async () => await User.find(filter).lean());

const findOne = (filter, data) =>
  execPromise(async () => await User.findOne(filter, data).orFail());

const create = (user, file) =>
  execPromise(async () => {
    const profilePic = file ? await uploadImage(file, usersFolder) : defaultPic;
    await User.create({ ...user, profilePic });
    return await User.findOneAndUpdate(
      user,
      {
        $set: {
          password: CryptoJS.SHA256(user.password).toString(CryptoJS.enc.Hex),
        },
      },
      { new: true, useFindAndModify: false }
    );
  });

const findOneAndUpdate = (filter, file, update) =>
  execPromise(async () => {
    if (file) {
      const { profilePic } = await User.findOne(filter);
      const newProfilePic = await updateImage(file, usersFolder, profilePic);
      await User.findOneAndUpdate(
        filter,
        { $set: { profilePic: newProfilePic } },
        { new: true, useFindAndModify: false }
      );
    }
    return await User.findOneAndUpdate(
      filter,
      {
        $set: {
          ...update,
          password: CryptoJS.SHA256(update.password).toString(CryptoJS.enc.Hex),
        },
      },
      { new: true, useFindAndModify: false }
    );
  });

const deleteOne = (filter) =>
  execPromise(async () => {
    const { _id, profilePic } = await User.findOne(filter);
    await Game.deleteMany({ user: _id });
    await Comment.deleteMany({ postedBy: _id });
    await Comment.deleteMany({ postedOn: "user", postedOnId: _id });
    await Transaction.deleteMany({ buyer: _id });
    await Transaction.deleteMany({ seller: _id });
    if (profilePic !== defaultPic) await deleteImage(profilePic);
    return await User.deleteOne(filter);
  });

module.exports = {
  findAll,
  findOne,
  create,
  findOneAndUpdate,
  deleteOne,
};
