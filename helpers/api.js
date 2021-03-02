const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { SECRET_KEY } = process.env;

// Connect with the database and start the server
const start = (uri, app, port) =>
  mongoose
    .connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then(() =>
      app.listen(port, () =>
        console.log(`Server is running on the port ${port}.`)
      )
    )
    .catch((err) => console.error("Unable to connect with the database:", err));

// Sign the JWT
const sign = (user, res) =>
  new Promise((resolve, reject) => {
    try {
      user
        ? jwt.sign({ user }, SECRET_KEY, { expiresIn: "3h" }, (err, token) =>
            resolve(!err ? { token } : res.status(404).json(err))
          )
        : res.status(404).json({ error: "Wrong username or password" });
    } catch (err) {
      console.error(err);
      reject(new Error(err));
    }
  });

// Verify token for every api request (except for creating the user)
const verifyToken = (req, res, next) => {
  const authorization = req.headers["authorization"];
  if (typeof authorization !== "undefined") {
    const token = authorization.split(" ")[1];
    req.token = token;
    next();
  } else res.sendStatus(403);
};

// Reduce public requests
const execRequest = (req, res, status, action) => {
  try {
    action();
  } catch (err) {
    console.log(err);
    res.status(status).json(err);
  }
};

// Reduce private requests
const privateRequest = (req, res, status, action) => {
  try {
    jwt.verify(req.token, SECRET_KEY, async (err) => {
      !err ? execRequest(req, res, status, action) : res.status(401).json(err);
    });
  } catch (err) {
    console.log(err);
    res.status(status).json(err);
  }
};

// Reduce image upload
const upload = async (file, res) => {
  try {
    const { name, mimetype } = file;
    const uploadPath = `${__dirname}/${name}`;
    const error = {
      error: "Wrong file type uploaded",
      message: "You can only upload JPG, JPEG or PNG file!",
    };
    mimetype === "image/jpg" ||
    mimetype === "image/jpeg" ||
    mimetype === "image/png"
      ? await file.mv(uploadPath, (err) => {
          if (err) return res.status(400).json(err);
        })
      : res.status(400).json(error);
  } catch (err) {
    console.error(err);
    res.status(500).json(new Error(err));
  }
};

module.exports = {
  start,
  sign,
  verifyToken,
  execRequest,
  privateRequest,
  upload,
};
