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

//Root route
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

//Authentication route
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

//User routes
app.get("/users", (req, res) => {
  execRequest(req, res, 404, async () => {
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

//Game routes
app.get("/games", (req, res) => {
  execRequest(req, res, 404, async () => {
    const { limit, offset } = req.query;
    const games = await Game.findAll(limit, offset);
    res.status(200).json(games);
  });
});

app.get("/game/:name", verifyToken, (req, res) => {
  privateRequest(req, res, 404, async () => {
    const { name } = req.params;
    const game = await Game.findOne({ name });
    res.status(200).json(game);
  });
});
//Last 3 routes are not finished, just setted up 
app.post("/game", verifyToken, (req, res) => {
  privateRequest(req, res, 400, async () => {
    const { body } = req;
    const game = await Game.create(body);
    res.status(201).json(game);
  });
});

app.put("/game/:name", verifyToken, (req, res) => {
  privateRequest(req, res, 400, async () => {});
});

app.delete("/game/:name", verifyToken, (req, res) => {
  privateRequest(req, res, 400, async () => {});
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
