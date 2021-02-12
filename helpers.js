const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

//Connect with the database
const connect = (uri) =>
  mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

const sign = (user, res) =>
  jwt.sign({ user }, "secretkey", { expiresIn: "3h" }, (err, token) =>
    !err ? res.status(201).json({ token }) : res.status(404).json(err)
  );

//Verify token for every api request (except for creating the user)
const verifyToken = (req, res, next) => {
  const authorization = req.headers["authorization"];
  if (typeof authorization !== "undefined") {
    const token = authorization.split(" ")[1];
    req.token = token;
    next();
  } else res.sendStatus(403);
};

const execController = (next, data) =>
  new Promise((res, rej) => {
    try {
      next();
      res(data);
    } catch (err) {
      console.log(err);
      rej(new Error(err));
    }
  });

const execRequest = (req, res, status, action) => {
  try {
    action();
  } catch (err) {
    console.log(err);
    res.status(status).json(err);
  }
};

const privateRequest = (req, res, status, action) => {
  try {
    jwt.verify(req.token, "secretkey", async (err) => {
      !err ? execRequest(req, res, status, action) : res.status(403).json(err);
    });
  } catch (err) {
    console.log(err);
    res.status(status).json(err);
  }
};

module.exports = {
  connect,
  sign,
  verifyToken,
  execController,
  execRequest,
  privateRequest,
};
