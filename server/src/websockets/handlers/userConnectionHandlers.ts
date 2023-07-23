// import { Server, Socket } from "socket.io";
// import SearchUserService from "../../services/searchService.js";

// export default function registerUserOnlineHandler(io: Server, socket: Socket) {
//     let userOnlineCount = 0
//     socket.on("user online:give user online count", async () => {
//         if(socket.handshake.headers.authorization)
//         io.emit("user online:give user online count", userOnlineCount);
//     })

//     socket.on("disconnect", async () => {
//         await SearchUserService.removeSearchUser(socket.id);
        
//         const userOnlineCount = io.sockets.sockets.size;
//         io.emit("user online:give user online count", userOnlineCount);
//         console.log("Client was disconnected");
//     })
// }