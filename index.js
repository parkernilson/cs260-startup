const { getDefaultUserInfo } = require('./backend/utils')
const express = require('express')

const app = express();

// The service port. In production the front-end code is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 3000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Serve up the front-end static content hosting
app.use(express.static('public'));

// Router for service endpoints
var apiRouter = express.Router();
app.use(`/api`, apiRouter);

apiRouter.post('/login-user/:username', (req, res) => {
  const username = req.params.username
  if (!db[username]) {
    db[username] = getDefaultUserInfo()
  }

  res.status(200).json(db[username])
})

// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

/**
 * @type {DB} 
 */
let db = {}