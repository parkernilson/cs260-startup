const { getDefaultUserInfo } = require("./backend/utils");
const express = require("express");
// const fileUpload = require('express-fileupload')
// const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')
// const { fromCognitoIdentityPool } = require("@aws-sdk/credential-providers")
// const { v4: uuid } = require('uuid')

const app = express();
// const s3 = new S3Client({
//   region: 'us-east-1',
//   credentials: fromCognitoIdentityPool({
//     identityPoolId: "us-east-1:ecb041b7-1150-478e-b82a-becb32d12f6f"
//   })
// })

// The service port. In production the front-end code is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 3000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Serve up the front-end static content hosting
app.use(express.static("public"));

// Router for service endpoints
const apiRouter = express.Router();
app.use(`/api`, apiRouter);

// apiRouter.use(fileUpload({
//   limits: { fileSize: 50 * 1024 * 1024 }
// }))

apiRouter.post("/:username/login", (req, res) => {
  const username = req.params.username;
  if (!db[username]) {
    db[username] = getDefaultUserInfo();
  }

  res.status(200).json(db[username]);
});

apiRouter.get("/:username/boards", (req, res) => {
  const username = req.params.username
  if (!db[username])
    return res.status(404).json({ message: "That user cannot be found" });
  if (!db[username]?.boards)
    return res.status(500).json({
      message: "An internal server error has occurred. Please try again later",
    });
  return res.status(200).json(db[username]);
});

apiRouter.get("/:username/boards/:boardId", (req, res) => {
  const username = req.params.username
  if (!db[username])
    return res.status(404).json({ message: "That user cannot be found" });
  if (!db[username]?.boards)
    return res.status(500).json({
      message: "An internal server error has occurred. Please try again later",
    });

  const boards = db[username].boards;
  const boardId = req.params.boardId;
  const board = boards.find((b) => b.id === boardId);

  return res.status(200).json({ board });
});

apiRouter.post("/:username/boards/set", (req, res) => {
  const username = req.params.username
  if (!db[username])
    return res.status(404).json({ message: "That user cannot be found" });
  if (!db[username]?.boards)
    return res.status(500).json({
      message: "An internal server error has occurred. Please try again later",
    });
  if (!req.body.boards)
    return res
      .status(400)
      .json({ message: "Invalid request body. Boards are required" });

  db[username].boards = req.body.boards;

  return res.status(201).json({ boards: db[username].boards });
});

apiRouter.put("/:username/boards/add", (req, res) => {
  const username = req.params.username
  if (!db[username])
    return res.status(404).json({ message: "That user cannot be found" });
  if (!db[username]?.boards)
    return res.status(500).json({
      message: "An internal server error has occurred. Please try again later",
    });
  if (!req.body.board)
    return res
      .status(400)
      .json({ message: "Invalid request body. Board is required" });

  const newBoard = { ...req.body.board, id: uuid() };

  db[username].boards.push(newBoard);

  return res.status(201).json(newBoard);
});

apiRouter.delete("/:username/boards/:boardId", (req, res) => {
  const username = req.params.username
  if (!db[username])
    return res.status(404).json({ message: "That user cannot be found" });
  if (!db[username]?.boards)
    return res.status(500).json({
      message: "An internal server error has occurred. Please try again later",
    });

  const boardId = req.params.boardId;
  const newBoards = db[username].boards.filter((b) => b.id !== boardId);
  db[username].boards = newBoards;

  return res.sendStatus(204);
});

apiRouter.post("/:username/boards/:boardId/sounds/set", (req, res) => {
  const username = req.params.username
  if (!db[username])
    return res.status(404).json({ message: "That user cannot be found" });
  if (!db[username]?.boards)
    return res.status(500).json({
      message: "An internal server error has occurred. Please try again later",
    });
  if (!req.body.sounds)
    return res
      .status(400)
      .json({ message: "Invalid request: sounds are required" });

  const boardId = req.params.boardId;
  const board = db[username].boards.find((b) => b.id === boardId);

  if (!board)
    return res.status(404).json({ message: "That board does not exist" });

  board.sounds = req.body.sounds;
  db[username].boards[db[username].boards.findIndex((b) => b.id === boardId)] =
    board;

  return res.status(201).json({ sounds: board.sounds });
});

apiRouter.put("/:username/boards/:boardId/sounds/add", (req, res) => {
  const username = req.params.username
  if (!db[username])
    return res.status(404).json({ message: "That user cannot be found" });
  if (!db[username]?.boards)
    return res.status(500).json({
      message: "An internal server error has occurred. Please try again later",
    });
  if (!req.body.sound)
    return res
      .status(400)
      .json({ message: "Invalid request: sound is required" });

  const boardId = req.params.boardId;
  const boardIndex = db[username].boards.findIndex((b) => b.id === boardId);
  const board = db[username].boards[boardIndex];

  board.sounds.push(req.body.sound);
  db[username].boards[boardIndex].sounds = board.sounds;

  return res.status(201).json({ sound: req.body.sound });
});

apiRouter.delete("/:username/boards/:boardId/sounds/:soundId", (req, res) => {
  const username = req.params.username
  if (!db[username])
    return res.status(404).json({ message: "That user cannot be found" });
  if (!db[username]?.boards)
    return res.status(500).json({
      message: "An internal server error has occurred. Please try again later",
    });

  const boardIndex = db[username].boards.findIndex(
    (b) => b.id === req.params.boardId
  );
  const newSounds = db[username].boards[boardIndex].sounds.filter(
    (s) => s.id !== req.params.soundId
  );
  db[username].boards[boardIndex].sounds = newSounds

  return res.sendStatus(204)
});

// apiRouter.post('/:username/upload-sound', async (req, res) => {
//   const file = req.files.soundFile
//   const username = req.params.username
//   const key = `${username}-${uuid()}`

//   const putObject = new PutObjectCommand({
//     Bucket: "storyteller-sounds",
//     Key: key,
//     Body: file
//   })

//   try {
//     await s3.send(putObject)

//     return res.send(201).json({
//       url: `https://storyteller-sounds.s3.us-east-1.amazonaws.com/${key}`
//     })
//   } catch(error) {
//     return res.status(500).json({message: error.message})
//   }
// })

// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile("index.html", { root: "public" });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

/**
 * @type {DB}
 */
let db = {
  defaultuser: getDefaultUserInfo()
};
