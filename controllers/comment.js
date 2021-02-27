const User = require("../models/user");
const Game = require("../models/game");
const Comment = require("../models/comment");
const {
  execController,
  skipNext,
  averageRating,
} = require("../helpers/controller");

const findAll = () => execController(skipNext, Comment.find().lean());

const findOne = (filter, data) =>
  execController(skipNext, Comment.findOne(filter, data));

const create = (comment) =>
  execController(async () => {
    const Model = comment.postedOn === "game" ? Game : User;
    await averageRating(comment, Comment, Model);
  }, Comment.create(comment));

const findOneAndUpdate = (filter, update) =>
  execController(
    async () => {
      const comment = await Comment.findOne(filter);
      const Model = comment.postedOn === "game" ? Game : User;
      await averageRating({ ...comment._doc, ...update.$set }, Comment, Model);
    },
    Comment.findOneAndUpdate(filter, update, {
      new: true,
      useFindAndModify: false,
    })
  );

const deleteOne = (filter) =>
  execController(async () => {
    const comment = await Comment.findOne(filter);
    const Model = comment.postedOn === "game" ? Game : User;
    await averageRating({ ...comment._doc, rating: 0 }, Comment, Model);
  }, Comment.deleteOne(filter));

module.exports = {
  findAll,
  findOne,
  create,
  findOneAndUpdate,
  deleteOne,
};
