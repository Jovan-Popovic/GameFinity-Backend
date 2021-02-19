const { google } = require("googleapis");

// To reduce controllers
const execController = (next, data) =>
  new Promise(async (res, rej) => {
    try {
      await next();
      res(await data);
    } catch (err) {
      console.log(err);
      rej(new Error(err));
    }
  });

// Skip next in execController
const skipNext = () => {};

const imageUpload = () => {};

module.exports = { skipNext, execController, imageUpload };
