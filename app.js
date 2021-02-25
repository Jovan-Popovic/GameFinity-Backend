const express = require("express");
const fileUpload = require("express-fileupload");
const compression = require("compression");
const cors = require("cors");
const { json } = require("body-parser");
const CryptoJS = require("crypto-js");
require("dotenv").config();

const User = require("./controllers/user");
const Game = require("./controllers/game");
const Comment = require("./controllers/comment");
const Transaction = require("./controllers/transaction");
const {
  connect,
  sign,
  verifyToken,
  execRequest,
  privateRequest,
} = require("./helpers/api");

const app = express();

app.use(compression());
app.use(fileUpload());
app.use(json());
app.use(cors());

// Root route
app.get("/", (req, res) =>
  execRequest(req, res, 500, () => {
    const data = {
      title: "Welcome to GameFinity's API",
      description:
        "GameFinity is a console games shop, the purpose of this application is to master the skills that we obtained through the Web Development - Backend course.",
      note:
        "If you want to get access to all of the the routes, you will need a JWT!",
    };
    res.status(200).json(data);
  })
);

// Authentication route
app.post("/login", (req, res) =>
  execRequest(req, res, 400, async () => {
    const { body } = req;
    const password = CryptoJS.SHA256(body.password).toString(CryptoJS.enc.Hex);
    const user = await User.findOne({ ...body, password }, [
      "email",
      "password",
    ]);
    sign(user, res);
  })
);

// User routes
app.get("/users", verifyToken, (req, res) =>
  privateRequest(req, res, 404, async () => {
    const users = await User.findAll();
    res.status(200).json(users);
  })
);

app.get("/user/:username", verifyToken, (req, res) =>
  privateRequest(req, res, 404, async () => {
    const { username } = req.params;
    const user = await User.findOne({ username });
    res.status(200).json(user);
  })
);

app.post("/user", (req, res) =>
  execRequest(req, res, 400, async () => {
    const { body } = req;
    const {
      profilePic,
      profilePic: { name, mimetype },
    } = req.files;
    const uploadPath = `${__dirname}/helpers/${name}`;
    const error = {
      error: "Wrong file type uploaded",
      message: "You can only upload JPG, JPEG or PNG file!",
    };
    mimetype === "image/jpg" ||
    mimetype === "image/jpeg" ||
    mimetype === "image/png"
      ? await profilePic.mv(uploadPath, async () => {
          const user = await User.create(body, profilePic);
          res.status(201).json(user);
        })
      : res.status(400).json(error);
  })
);

app.put("/user/:username", verifyToken, (req, res) =>
  privateRequest(req, res, 400, async () => {
    const { username } = req.params;
    const { body } = req;
    const user = await User.findOneAndUpdate({ username }, { $set: body });
    res.status(201).json(user);
  })
);

app.delete("/user/:username", verifyToken, (req, res) =>
  privateRequest(req, res, 400, async () => {
    const { username } = req.params;
    const user = await User.deleteOne({ username });
    res.status(200).json(user);
  })
);

// Game routes
app.get("/games", (req, res) =>
  execRequest(req, res, 404, async () => {
    const { limit, offset } = req.query;
    const games = await Game.findAll(limit, offset);
    res.status(200).json(games);
  })
);

app.get("/game/:name", verifyToken, (req, res) =>
  privateRequest(req, res, 404, async () => {
    const { name } = req.params;
    const game = await Game.findOne({ name });
    res.status(200).json(game);
  })
);

app.post("/game", verifyToken, (req, res) =>
  privateRequest(req, res, 400, async () => {
    const { body } = req;
    const {
      image,
      image: { name, mimetype },
    } = req.files;
    const uploadPath = `${__dirname}/helpers/${name}`;
    const error = {
      error: "Wrong file type uploaded",
      message: "You can only upload JPG, JPEG or PNG file!",
    };
    mimetype === "image/jpg" ||
    mimetype === "image/jpeg" ||
    mimetype === "image/png"
      ? await image.mv(uploadPath, async () => {
          const game = await Game.create(body, image);
          res.status(201).json(game);
        })
      : res.status(400).json(error);
  })
);

app.put("/game/:name", verifyToken, (req, res) =>
  privateRequest(req, res, 400, async () => {
    const { name } = req.params;
    const { body } = req;
    const game = await Game.findOneAndUpdate({ name }, { $set: body });
    res.status(201).json(game);
  })
);

app.delete("/game/:name", verifyToken, (req, res) =>
  privateRequest(req, res, 400, async () => {
    const { name } = req.params;
    const game = await Game.deleteOne({ name });
    res.status(200).json(game);
  })
);

// Comment routes
app.get("/comments", verifyToken, (req, res) =>
  privateRequest(req, res, 400, async () => {
    const comments = await Comment.findAll();
    res.status(200).json(comments);
  })
);

app.get("/comment/:_id", verifyToken, (req, res) =>
  privateRequest(req, res, 404, async () => {
    const { _id } = req.params;
    const game = await Comment.findOne({ _id });
    res.status(200).json(game);
  })
);

app.post("/comment", verifyToken, (req, res) =>
  privateRequest(req, res, 400, async () => {
    const { body } = req;
    const comment = await Comment.create(body);
    res.status(201).json(comment);
  })
);

app.put("/comment/:_id", verifyToken, (req, res) =>
  privateRequest(req, res, 400, async () => {
    const { _id } = req.params;
    const { body } = req;
    const comment = await Comment.findOneAndUpdate({ _id }, { $set: body });
    res.status(201).json(comment);
  })
);

app.delete("/comment/:_id", verifyToken, (req, res) =>
  privateRequest(req, res, 400, async () => {
    const { _id } = req.params;
    const comment = await Comment.deleteOne({ _id });
    res.status(200).json(comment);
  })
);

// Transaction routes
app.get("/transactions", verifyToken, (req, res) =>
  privateRequest(req, res, 400, async () => {
    const transactions = await Transaction.findAll();
    res.status(200).json(transactions);
  })
);

app.get("/transaction/:_id", verifyToken, (req, res) =>
  privateRequest(req, res, 404, async () => {
    const { _id } = req.params;
    const transaction = await Transaction.findOne({ _id });
    res.status(200).json(transaction);
  })
);

app.post("/transaction", verifyToken, (req, res) =>
  privateRequest(req, res, 400, async () => {
    const { body } = req;
    const transaction = await Transaction.create(body);
    res.status(201).json(transaction);
  })
);

app.put("/transaction/:_id", verifyToken, (req, res) =>
  privateRequest(req, res, 400, async () => {
    const { _id } = req.params;
    const { body } = req;
    const transaction = await Transaction.findOneAndUpdate(
      { _id },
      { $set: body }
    );
    res.status(201).json(transaction);
  })
);

app.delete("/transaction/:_id", verifyToken, (req, res) =>
  privateRequest(req, res, 400, async () => {
    const { _id } = req.params;
    const transaction = await Transaction.deleteOne({ _id });
    res.status(200).json(transaction);
  })
);

const PORT = process.env.PORT || 5000;

// Connecting to the server
connect(process.env.DB_URI)
  .then(() =>
    app.listen(PORT, () =>
      console.log(`Server is running on the port ${PORT}.`)
    )
  )
  .catch((err) => console.error("Unable to connect with the database:", err));
