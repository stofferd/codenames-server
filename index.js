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

io.on("connection", (socket) => {
  console.log("a user connected");
  console.log(socket.rooms);
});

http.listen(3000, () => {
  console.log("listening on *:3000");
});
