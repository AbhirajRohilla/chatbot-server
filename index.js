const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");

const app = express();
const socket = require("socket.io");
require("dotenv").config();

app.use(cors())
app.use(express.json());

mongoose
  .connect("mongodb+srv://abhirajrohilla:abcdefg@cluster1.2jwio.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1", {dbName : "chat",})
  .then(() => {
    console.log("DataBase Conneted Successfully");
  })
  .catch((err) => {
    // console.log();
    console.log("error aa rha h", err.message);
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/messages", messageRoutes);


const server = app.listen(8000, () => {
    console.log(`Server running on port 8000 `)
})

const io = socket(server, {
  cors: {
    origin:"http://localhost:5173",
    credentials: true,
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
});