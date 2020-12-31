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

// io.on("connection", (socket) => {

//     socket.join('some room');

//   console.log("a user connected");
//   console.log(socket.rooms);

// });

io.sockets.on("connection", function (socket) {
  socket.on("join", function (room) {
    socket.join(room);
    // console.log(socket);
  });
  socket.on("testes", (arg) => {
    console.log(arg);
    socket.to("room1").emit("test2", "HEYHEYHEY");

    const clientsList = io.sockets.adapter.rooms["room1"];
    // var numClients = clientsList.length;

    socket.to("room1").emit("clients", clientsList);
  });
});

http.listen(3000, () => {
  console.log("listening on *:3000");
});
