import bodyParser from "body-parser";
import express from "express";
import http from "http";
import path from "path";
import socketio from "socket.io";
import { log } from "./utils-server";

const clientDir: string = path.join(__dirname, "/../client/public");
const app: express.Application = express();
const server: http.Server = http.createServer(app);
const io: SocketIO.Server = socketio.listen(server);

app.use(bodyParser.json());
app.use("/todo", require("./routes/todo/route.js").createRoute("todo", io));
app.use("/", require("./routes/home/route.js").createRoute("", io));

const port: number = 3006;
server.listen(port, "0.0.0.0", () => {
    log(`listening at ${port}`);
});
