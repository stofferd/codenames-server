var app = require("express")();
var http = require("http").createServer(app);
require("dotenv").config();

const port = process.env.PORT || 3000;

const io = require("socket.io")(http, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
  },
});

app.get("/", (req, res, next) => {
  res.send("<h1>Hello world</h1>");
});

io.sockets.on("connection", function (socket) {
  socket.on("join", function (room) {
    socket.join(room);
  });

  socket.on("startGame", async ({ gameHash, socketID }) => {
    const ids = await io.in(gameHash).allSockets();
    const socketIndex = [...ids].indexOf(socketID);
    io.to(socketID).emit("startGame", socketIndex);
  });

  socket.on("endTurn", ({ gameHash, playerIndex }) => {
    io.to(gameHash).emit("endTurn", playerIndex);
  });

  socket.on("makeGuess", ({ gameHash, playerIndex, index, answer }) => {
    io.to(gameHash).emit("makeGuess", playerIndex, index, answer);
  });
});

http.listen(port, () => {
  console.log(`listening on *:${port}`);
});
