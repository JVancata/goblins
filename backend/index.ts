import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "node:http";

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173"
    }
});
const port = 3000;

app.use(cors());
app.use(express.json());

let allUsers: unknown[] = [];

io.on('connection', (socket) => {
    console.log('a user connected');
    let userId = "";
    socket.on("user-position", (message) => {
        const parsedUser = JSON.parse(message);
        userId = parsedUser.id;
        const index = allUsers.findIndex((user) => user.id === parsedUser.id);
        if (index >= 0) {
            allUsers[index] = parsedUser;
        }
        else {
            allUsers.push(parsedUser);
        }
    });

    socket.on("disconnect", () => {
        allUsers = allUsers.filter((user) => user.id !== userId);
    })
});

setInterval(() => {
    io.emit("data", JSON.stringify(allUsers));
    console.log("Sending user data", allUsers);
}, 25)

app.post("/", (req, res) => {
    const { body } = req;
    console.log("Received body", body);

    res.send("This is a POST endpoint!");
});

app.get("/", (req, res) => {
    // If you want to send a JSON, use res.json(...) instead
    res.send("This is a GET endpoint!");
});

server.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});