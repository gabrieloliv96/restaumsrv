const http = require("http");
const socketIO = require("socket.io");

const server = http.createServer();
const io = socketIO(server);

const clients = [];

io.on("connection", (socket) => {
  if (clients.length < 2) clients.push(socket);

  socket.on("message", (data) => {
    const otherClient = findClient(socket);
    if (otherClient !== undefined) {
      otherClient.emit("message", `${data}`);
    }
  });

  socket.on("board-moviment", (data) => {
    const otherClient = findClient(socket);
    if (otherClient !== undefined) {
      otherClient.emit("board-moviment", `${data}`);
      console.log(`Movida por ${otherClient.id} : ${data}`);
    }
  });

  // Jogador solicitou a desistencia
  socket.on("give-up", (data) => {
    const otherClient = findClient(socket);
    if (otherClient !== undefined) {
      otherClient.emit("give-up", `${data}`);
      console.log(`Jogador solicitou desistencia : ${data}`);
    }
  });
  
  socket.on("turn-end", (data) => {
    const otherClient = findClient(socket);
    if (otherClient !== undefined) {
      otherClient.emit("turn-end",);
      console.log(`Fim do turno de ${data}`);
    }
  });

  // Jogador aceitou a desistencia
  socket.on("acept-give-up", (data) => {
    const otherClient = findClient(socket);
    if (otherClient !== undefined) {
      otherClient.emit("acept-give-up", `${data}`);
      console.log(`Jogardor desistiu : ${data}`);
    }
  });

  socket.on("disconnect", () => {
    const clientIndex = clients.findIndex(
      (_client) => _client.id === socket.id
    );
    clients.splice(clientIndex, 1);
    console.log(`Client desconectado: ${socket.id}`);
  });
});

server.listen(3000, () => {
  console.log("Server started on port 3000");
});

function findClient(socket) {
  console.log(socket.id);
  return clients.find((_client) => _client.id !== socket.id);
}
