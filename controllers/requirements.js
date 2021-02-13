const Requirements = require("../models/requirements");

const { execController, skipNext } = require("../helpers");

const findAll = () => execController(skipNext, Requirements.find().lean());

const findOne = (prop, filter) =>
  execController(skipNext, Requirements.findOne(prop, filter));

const create = (requirements) =>
  execController(skipNext, Requirements.create(requirements));

const findOneAndUpdate = (filter, update) =>
  execController(
    skipNext,
    Requirements.findOneAndUpdate(filter, update, {
      new: true,
      useFindAndModify: false,
    })
  );

const deleteOne = (filter) =>
  execController(skipNext, Requirements.deleteOne(filter));

module.exports = {
  findAll,
  findOne,
  create,
  findOneAndUpdate,
  deleteOne,
};
