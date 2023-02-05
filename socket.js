const cors = require('cors');
const express = require("express")

const app = express()
app.use(cors())
// socket io
const io = require("socket.io")(8800, { cors: { origin: "*" } });

let activeUsers = [];

io.on("connection", (socket) => {
    // add new user
    socket.on("new-user-add", (newUserId) => {
        // if user not added previously
        if (!activeUsers.some((user) => user.userId === newUserId)) {
            activeUsers.push({
                userId: newUserId,
                socketId: socket.id,
            });
        }


        io.emit("get-users", activeUsers);
    });

    //send message
    socket.on("send-message", (data) => {
        const { receiverId } = data
        const user = activeUsers.find((user) => user.userId === receiverId)
        if (user) {
            io.to(user.socketId).emit("receive-message", data)
        }
    });

    socket.on("disconnect", () => {
        activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
        io.emit("get-users", activeUsers);
    });
});
console.log('running successfully');