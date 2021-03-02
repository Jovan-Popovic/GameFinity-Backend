const User = require("../models/user");
const Game = require("../models/game");
const Comment = require("../models/comment");
const { execPromise, averageRating } = require("../helpers/controller");

const findAll = () => execPromise(async () => await Comment.find().lean());

const findOne = (filter, data) =>
  execPromise(async () => await Comment.findOne(filter, data));

const create = (comment) =>
  execPromise(async () => {
    const Model = comment.postedOn === "game" ? Game : User;
    await averageRating(comment, Comment, Model);
    return await Comment.create(comment);
  });

const findOneAndUpdate = (filter, update) =>
  execPromise(async () => {
    const comment = await Comment.findOne(filter);
    const Model = comment.postedOn === "game" ? Game : User;
    await averageRating({ ...comment._doc, ...update }, Comment, Model);
    return await Comment.findOneAndUpdate(
      filter,
      { $set: { ...update } },
      {
        new: true,
        useFindAndModify: false,
      }
    );
  });

const deleteOne = (filter) =>
  execPromise(async () => {
    const comment = await Comment.findOne(filter);
    const Model = comment.postedOn === "game" ? Game : User;
    await averageRating({ ...comment._doc, rating: 0 }, Comment, Model);
    return await Comment.deleteOne(filter);
  });

module.exports = {
  findAll,
  findOne,
  create,
  findOneAndUpdate,
  deleteOne,
};
