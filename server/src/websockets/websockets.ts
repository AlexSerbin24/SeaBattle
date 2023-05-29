import http from "http";
import { Server } from "socket.io";

export default function websocketSetup(server: http.Server) {
    const io = new Server(server);
    io.on('connection',()=>{
        console.log("Connection")
    })
}