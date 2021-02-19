const Comment = require("../models/comment");
const { execController, skipNext } = require("../helpers/controller");

const findAll = () => execController(skipNext, Comment.find().lean());

const findOne = (filter, data) =>
  execController(skipNext, Comment.findOne(filter, data));

const create = (comment) => execController(skipNext, Comment.create(comment));

const findOneAndUpdate = (filter, update) =>
  execController(
    skipNext,
    Comment.findOneAndUpdate(filter, update, {
      new: true,
      useFindAndModify: false,
    })
  );

const deleteOne = (filter) =>
  execController(skipNext, Comment.deleteOne(filter));

module.exports = {
  findAll,
  findOne,
  create,
  findOneAndUpdate,
  deleteOne,
};
