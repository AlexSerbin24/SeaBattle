import { Server, Socket } from "socket.io";
import SearchUserService from "../../services/searchService.js";

export default function registerDisconnectHandler(io: Server, socket: Socket) {
    socket.on("disconnect", async () => {
        await SearchUserService.removeSearchUser(socket.id);
        
        const userOnlineCount = io.sockets.sockets.size;
        io.emit("user online:give user online count", userOnlineCount);
        console.log("Client was disconnected");
    })
}