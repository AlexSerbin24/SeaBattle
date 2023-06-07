import { Server, Socket } from "socket.io";
import SearchUserService from "../../services/searchService.js";

export default function registerDisconnectHandler(io:Server, socket:Socket){
    socket.on("disconnect", async()=>{
        await SearchUserService.removeSearchUser(socket.id);
        console.log("Client was disconnected");
    })
}