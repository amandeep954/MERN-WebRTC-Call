const { Server } = require("socket.io");

const io = new Server(8000, { cors: true });

io.on("connection", (socket) => {
  console.log(`${socket.id} connected`);
  socket.on("room:Join", (data) => {
    const { email, room } = data;
    io.to(room).emit("user:Joined", { email, id: socket.id });
    socket.join(room);
    socket.emit("room:Join", data);
  });
  socket.on("user:call", ({ to, offer }) => {
    io.to(to).emit("incomming:call", { from: socket.id, offer });
    console.log(`Call from ${socket.id} to ${to}`);
  });
  socket.on("call:accepted", ({ to, ans }) => {
    io.to(to).emit("call:accepted", { from: socket.id, ans });
  });
   socket.on("peer:nego:needed", ({ to, offer }) => {
    console.log("peer:nego:needed", offer);
    io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
  });
  socket.on("peer:nego:done", ({ to, ans }) => {
    console.log("peer:nego:done", ans);
    io.to(to).emit("peer:nego:final", { from: socket.id, ans });
  }); 
  socket.on("ice:candidate", ({ to, candidate }) => {
    io.to(to).emit("ice:candidate", { from: socket.id, candidate });
  });
});
