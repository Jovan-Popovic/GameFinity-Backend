const express = require("express");
const { json } = require("body-parser");
require("dotenv").config();

const User = require("./controllers/user");
const Game = require("./controllers/game");
const Requirements = require("./controllers/requirements");
const Comment = require("./controllers/comment");
const Transaction = require("./controllers/transaction");
const { connect, verifyToken } = require("./helpers");

const app = express();

app.use(json());

app.get("/", (req, res) => {
  try {
    const data = {
      title: "Welcome to GameFinity API",
      description:
        "GameFinity is a console games shop, the purpose of this application is to master the skills that we obtained through the Web Development - Backend course.",
      note: "If you want to get access to the routes, you will need a JWT!",
    };
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
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
