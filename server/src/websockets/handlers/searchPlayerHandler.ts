import { Server, Socket } from "socket.io";
import SearchUserService from "../../services/searchService.js";
import SearchUserData from "../../types/searchUserData.js";

export default function registerSearchPlayerHandlers(io: Server, socket: Socket) {
    socket.on("search opponent:searching", async ({username, trophies}: Omit<SearchUserData, "socketId">) => {
        const opponent = await SearchUserService.findSuitableOpponent(trophies);
        if (opponent) {
            await SearchUserService.removeSearchUser(opponent.socketId);//нужно еще будет учитывать, что пользователь мог ливнуть, когда искал оппонента
            const room = `${socket.id}-${opponent.socketId}`;
            
            const opponentSocket = io.sockets.sockets.get(opponent.socketId);
            opponentSocket?.join(room);
            socket.join(room);
            
            io.to(opponent.socketId).emit("search opponent:opponent found",{room, opponent: username});
            io.to(socket.id).emit("search opponent:opponent found", {room, opponent: opponent.username});
            return;
        }

        await SearchUserService.addSearchUser({ socketId: socket.id, trophies, username });
    });



}