import http from "http";
import { Server } from "socket.io";
import registerSearchPlayerHandlers from "./handlers/searchPlayerHandler";
import registerGameHandlers from "./handlers/gameHandlers";
import SearchUserService from "../services/searchService";
import TokenService from "../services/tokenService";

export default function websocketSetup(server: http.Server) {
    let userOnlineCount = 0;

    const io = new Server(server, { cors: { origin: "http://localhost:3000" } });


    io.on('connection', (socket) => {
        if (socket.handshake.headers.authorization) {
            userOnlineCount++;
            io.emit("user online:give user online count", userOnlineCount);
        }
        socket.on("user online:give user online count", async () => {
            io.emit("user online:give user online count", userOnlineCount);
        });

        registerSearchPlayerHandlers(io, socket);
        registerGameHandlers(io, socket);

        socket.on("disconnect", async () => {
            if (socket.handshake.headers.authorization) {
                await SearchUserService.removeSearchUser(socket.id);
                userOnlineCount--;
                io.emit("user online:give user online count", userOnlineCount);
                console.log("Client was disconnected");
            }
        })
    })
}