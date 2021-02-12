const express = require("express");
const { json } = require("body-parser");
const CryptoJS = require("crypto-js");
require("dotenv").config();

const User = require("./controllers/user");
const Game = require("./controllers/game");
const Requirements = require("./controllers/requirements");
const Comment = require("./controllers/comment");
const Transaction = require("./controllers/transaction");
const {
  connect,
  sign,
  verifyToken,
  execRequest,
  privateRequest,
} = require("./helpers");

const app = express();

app.use(json());

app.get("/", (req, res) =>
  execRequest(req, res, 400, () => {
    const data = {
      title: "Welcome to GameFinity API",
      description:
        "GameFinity is a console games shop, the purpose of this application is to master the skills that we obtained through the Web Development - Backend course.",
      note: "If you want to get access to the routes, you will need a JWT!",
    };
    res.status(200).json(data);
  })
);

app.post("/login", (req, res) =>
  execRequest(req, res, 400, async () => {
    const { body } = req;
    const password = CryptoJS.SHA256(body.password).toString(CryptoJS.enc.Hex);
    const user = await User.findOne({ ...body, password }, [
      "email",
      "password",
    ]);
    console.log(user);
    sign(user, res);
  })
);

app.get("/users", verifyToken, (req, res) => {
  privateRequest(req, res, 404, async () => {
    const users = await User.findAll();
    res.status(200).json(users);
  });
});

app.get("/user/:username", verifyToken, (req, res) => {
  privateRequest(req, res, 404, async () => {
    const { username } = req.params;
    const user = await User.findOne({ username });
    res.status(200).json(user);
  });
});

app.post("/user", (req, res) => {
  execRequest(req, res, 400, async () => {
    const { body } = req;
    const user = await User.create(body);
    res.status(201).json(user);
  });
});

app.put("/user/:username", verifyToken, (req, res) =>
  privateRequest(req, res, 400, async () => {
    const { username } = req.params;
    const { body } = req;
    const user = await User.findOneAndUpdate(
      { username },
      { $set: { ...body } }
    );
    res.status(201).json(user);
  })
);

app.delete("/user/:username", verifyToken, (req, res) => {
  privateRequest(req, res, 400, async () => {
    const { username } = req.params;
    const user = await User.deleteOne({ username });
    res.status(200).json(user);
  });
});

const PORT = process.env.PORT || 5000;

//Connecting to the server
connect(process.env.DB_URI)
  .then(() =>
    app.listen(PORT, () =>
      console.log(`Server is running on the port ${PORT}.`)
    )
  )
  .catch((err) => console.error("Unable to connect with the database:", err));
