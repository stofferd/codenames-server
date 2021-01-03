var app = require("express")();
var http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3001",
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

  socket.on("makeGuess", ({ gameHash, index, answer }) => {
    io.to(gameHash).emit("makeGuess", index, answer);
  });
});

http.listen(3000, () => {
  console.log("listening on *:3000");
});
