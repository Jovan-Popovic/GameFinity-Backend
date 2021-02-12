const mongoose = require("mongoose");

//Connect with the database
const connect = (uri) =>
  mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

//Verify token for every api request (except for creating the user)
const verifyToken = (req, res, next) => {
  const authorization = req.headers["Authorization"];
  if (typeof authorization !== "undefined") {
    const token = authorization.split(" ")[1];
    req.token = token;
    next();
  } else res.sendStatus(403);
};

module.exports = { connect, verifyToken };
