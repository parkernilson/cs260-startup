const { getDefaultUserInfo } = require("./public/backend/utils");
const express = require("express");
const { getDB, getUser, getUserByToken, createUser } = require("./database");
const { v4: uuid } = require('uuid')
const cookieParser = require('cookie-parser')
const bcrypt = require('bcrypt')

const AUTH_COOKIE_NAME = 'storyteller-token'

const app = express();

// The service port. In production the front-end code is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 4000;

// JSON body parsing using built-in middleware
app.use(express.json());

app.use(cookieParser())

// Serve up the front-end static content hosting
app.use(express.static("public"));

app.set('trust proxy', true)

// Router for service endpoints
const apiRouter = express.Router();
app.use(`/api`, apiRouter);

// CreateAuth token for a new user
apiRouter.post('/auth/create', async (req, res) => {
  if (await getUser(req.body.username)) {
    res.status(409).send({ msg: 'Existing user' });
  } else {
    const user = await createUser(req.body.username, req.body.password);

    // Set the cookie
    setAuthCookie(res, user.token);

    res.send({
      id: user._id,
    });
  }
});

// GetAuth token for the provided credentials
apiRouter.post('/auth/login', async (req, res) => {
  const user = await getUser(req.body.username);
  if (user) {
    if (await bcrypt.compare(req.body.password, user.password)) {
      setAuthCookie(res, user.token);
      res.send({ id: user._id });
      return;
    }
  }
  res.status(401).send({ msg: 'Unauthorized' });
});

// DeleteAuth token if stored in cookie
apiRouter.delete('/auth/logout', (_req, res) => {
  res.clearCookie(authCookieName);
  res.status(204).end();
});

// GetUser returns information about a user
apiRouter.get('/user/:username', async (req, res) => {
  const user = await getUser(req.params.username);
  if (user) {
    const token = req?.cookies.token;
    res.send({ username: user.username, authenticated: token === user.token });
    return;
  }
  res.status(404).send({ msg: 'Unknown' });
});

apiRouter.get("/:username/boards", async (req, res) => {
  const db = await getDB();
  const user = await db
    .collection("users")
    .findOne({ username: req.params.username });

  if (!user)
    return res.status(404).json({ message: "That user cannot be found" });

  const token = req.cookies?.[AUTH_COOKIE_NAME]

  if (!token)
    return res.status(401).send({ message: "You are not logged in" })
  if (token !== user?.token)
    return res.status(401).json({ message: "You are unauthorized to perform this action" })

  if (!user.boards)
    return res.status(500).json({
      message: "An internal server error has occurred. Please try again later",
    });

  return res.status(200).json({ boards: user.boards });
});

apiRouter.get("/:username/boards/:boardId", async (req, res) => {
  const username = req.params.username;
  const db = await getDB();
  const user = await db.collection("users").findOne({ username });

  if (!user)
    return res.status(404).json({ message: "That user cannot be found" });

  const token = req.cookies?.[AUTH_COOKIE_NAME]

  if (!token)
    return res.status(401).send({ message: "You are not logged in" })
  if (token !== user?.token)
    return res.status(401).json({ message: "You are unauthorized to perform this action" })

  if (!user?.boards)
    return res.status(500).json({
      message: "An internal server error has occurred. Please try again later",
    });

  const boards = user.boards;
  const boardId = req.params.boardId;
  const board = boards.find((b) => b.id === boardId);

  return res.status(200).json({ board });
});

apiRouter.post("/:username/boards/set", async (req, res) => {
  const username = req.params.username;
  const db = await getDB();
  const user = await db.collection("users").findOne({ username });

  if (!user)
    return res.status(404).json({ message: "That user cannot be found" });

  const token = req.cookies?.[AUTH_COOKIE_NAME]

  if (!token)
    return res.status(401).send({ message: "You are not logged in" })
  if (token !== user?.token)
    return res.status(401).json({ message: "You are unauthorized to perform this action" })

  if (!user?.boards)
    return res.status(500).json({
      message: "An internal server error has occurred. Please try again later",
    });
  if (!req.body.boards)
    return res
      .status(400)
      .json({ message: "Invalid request body. Boards are required" });

  await db.collection("users").updateOne(
    { username },
    {
      $set: {
        boards: req.body.boards,
      },
    }
  );

  return res.status(201).json({ boards: req.body.boards });
});

apiRouter.post("/:username/boards/add", async (req, res) => {
  const username = req.params.username;
  const db = await getDB();
  const user = await db.collection("users").findOne({ username });

  if (!user)
    return res.status(404).json({ message: "That user cannot be found" });

  const token = req.cookies?.[AUTH_COOKIE_NAME]

  if (!token)
    return res.status(401).send({ message: "You are not logged in" })
  if (token !== user?.token)
    return res.status(401).json({ message: "You are unauthorized to perform this action" })

  if (!user?.boards)
    return res.status(500).json({
      message: "An internal server error has occurred. Please try again later",
    });
  if (!req.body.board)
    return res
      .status(400)
      .json({ message: "Invalid request body. Board is required" });

  const newBoard = { ...req.body.board, id: uuid() };

  await db
    .collection("users")
    .updateOne({ username }, { $push: { boards: newBoard } });

  return res.status(201).json({ board: newBoard });
});

apiRouter.delete("/:username/boards/:boardId", async (req, res) => {
  const username = req.params.username;
  const db = await getDB();
  const user = await db.collection("users").findOne({ username });

  if (!user)
    return res.status(404).json({ message: "That user cannot be found" });

  const token = req.cookies?.[AUTH_COOKIE_NAME]

  if (!token)
    return res.status(401).send({ message: "You are not logged in" })
  if (token !== user?.token)
    return res.status(401).json({ message: "You are unauthorized to perform this action" })

  if (!user?.boards)
    return res.status(500).json({
      message: "An internal server error has occurred. Please try again later",
    });

  const boardId = req.params.boardId;
  await db
    .collection("users")
    .updateOne({ username }, { $pull: { boards: { id: boardId } } });

  return res.sendStatus(204);
});

apiRouter.post("/:username/boards/:boardId/sounds/set", async (req, res) => {
  const username = req.params.username;
  const db = await getDB();
  const user = await db.collection("users").findOne({ username });

  if (!user)
    return res.status(404).json({ message: "That user cannot be found" });

  const token = req.cookies?.[AUTH_COOKIE_NAME]

  if (!token)
    return res.status(401).send({ message: "You are not logged in" })
  if (token !== user?.token)
    return res.status(401).json({ message: "You are unauthorized to perform this action" })

  if (!user?.boards)
    return res.status(500).json({
      message: "An internal server error has occurred. Please try again later",
    });
  if (!req.body.sounds)
    return res
      .status(400)
      .json({ message: "Invalid request: sounds are required" });

  const boardId = req.params.boardId;
  const board = user.boards.find((b) => b.id === boardId);

  if (!board)
    return res.status(404).json({ message: "That board does not exist" });

  await db.collection("users").updateOne(
    { username },
    { $set: { "boards.$[b].sounds": req.body.sounds } },
    {
      arrayFilters: [
        {
          b: { id: boardId },
        },
      ],
    }
  );

  return res.status(201).json({ sounds: req.body.sounds });
});

apiRouter.post("/:username/boards/:boardId/sounds/add", async (req, res) => {
  const username = req.params.username;
  const db = await getDB();
  const user = await db.collection("users").findOne({ username });

  if (!user)
    return res.status(404).json({ message: "That user cannot be found" });

  const token = req.cookies?.[AUTH_COOKIE_NAME]

  if (!token)
    return res.status(401).send({ message: "You are not logged in" })
  if (token !== user?.token)
    return res.status(401).json({ message: "You are unauthorized to perform this action" })

  if (!user?.boards)
    return res.status(500).json({
      message: "An internal server error has occurred. Please try again later",
    });
  if (!req.body.sound)
    return res
      .status(400)
      .json({ message: "Invalid request: sound is required" });

  const boardId = req.params.boardId;

  const result = await db.collection("users").updateOne(
    { username },
    {
      $push: {
        "boards.$[b].sounds": req.body.sound,
      },
    },
    {
      arrayFilters: [
        {
          "b.id": boardId
        }
      ]
    }
  );

  return res.status(201).json({ sound: req.body.sound });
});

apiRouter.delete(
  "/:username/boards/:boardId/sounds/:soundId",
  async (req, res) => {
    const username = req.params.username;
    const db = await getDB();
    const user = await db.collection("users").findOne({ username });

    if (!user)
      return res.status(404).json({ message: "That user cannot be found" });

    const token = req.cookies?.[AUTH_COOKIE_NAME]

    if (!token)
      return res.status(401).send({ message: "You are not logged in" })
    if (token !== user?.token)
      return res.status(401).json({ message: "You are unauthorized to perform this action" })

    if (!user?.boards)
      return res.status(500).json({
        message:
          "An internal server error has occurred. Please try again later",
      });

    const boardId = req.params.boardId;
    const soundId = req.params.soundId;

    await db.collection("users").updateOne(
      { username },
      {
        $pull: {
          "boards.$[b].sounds": { id: soundId },
        },
      },
      {
        arrayFilters: [
          {
            "b.id": boardId
          }
        ]
      }
    );

    return res.sendStatus(204);
  }
);

// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile("index.html", { root: "public" });
});

// setAuthCookie in the HTTP response
const setAuthCookie = (res, authToken) => {
  res.cookie(AUTH_COOKIE_NAME, authToken, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
