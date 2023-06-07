import http from "http";
import { Server } from "socket.io";
import registerSearchPlayerHandlers from "./handlers/searchPlayerHandler.js";
import registerGameHandlers from "./handlers/gameHandlers.js";
import registerDisconnectHandler from "./handlers/disconnectHandler.js";

export default function websocketSetup(server: http.Server) {
    const io = new Server(server);
    io.on('connection',(socket)=>{
        console.log(socket.id)
        registerSearchPlayerHandlers(io,socket);
        registerGameHandlers(io,socket);
        registerDisconnectHandler(io,socket)
    })
}