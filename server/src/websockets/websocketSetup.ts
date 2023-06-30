import http from "http";
import { Server } from "socket.io";
import registerSearchPlayerHandlers from "./handlers/searchPlayerHandler.js";
import registerGameHandlers from "./handlers/gameHandlers.js";
import registerDisconnectHandler from "./handlers/disconnectHandler.js";

export default function websocketSetup(server: http.Server) {
    const io = new Server(server,{cors:{origin:"http://localhost:3000"}});
    io.on('connection',(socket)=>{
        const userOnlineCount = io.sockets.sockets.size;
        io.emit("user online:give user online count", userOnlineCount);
        
        registerSearchPlayerHandlers(io,socket);
        registerGameHandlers(io,socket);
        registerDisconnectHandler(io,socket)
    })
}