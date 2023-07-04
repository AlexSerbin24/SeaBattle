import { Server, Socket } from "socket.io";
import SearchUserService from "../../services/searchService.js";

export default function registerUserOnlineHandler(io: Server, socket: Socket) {
    socket.on("user online:give user online count", async () => {
        const userOnlineCount = io.sockets.sockets.size;
        io.emit("user online:give user online count", userOnlineCount);
    })
}