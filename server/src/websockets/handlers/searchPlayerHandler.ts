import { Server, Socket } from "socket.io";
import SearchUserService from "../../services/searchService.js";
import SearchUserData from "../../types/searchUserData.js";
import TokenService from "../../services/tokenService.js";

export default function registerSearchPlayerHandlers(io: Server, socket: Socket) {
    socket.on("search opponent:searching", async ({username, trophies}: Omit<SearchUserData, "socketId">) => {
        const token = socket.handshake.headers.authorization as string;
        if(!TokenService.validateAccessToken(token)){
            socket.emit("search opponent:invalid token");
            return;
        }   

        const opponent = await SearchUserService.findSuitableOpponent(trophies);
        if (opponent) {
            await SearchUserService.removeSearchUser(opponent.socketId);//нужно еще будет учитывать, что пользователь мог ливнуть, когда искал оппонента
            const room = `${socket.id}-${opponent.socketId}`;
            const currentPlayer = [username, opponent.username][Math.floor(Math.random() * 2)];

            const opponentSocket = io.sockets.sockets.get(opponent.socketId);
            opponentSocket?.join(room);
            socket.join(room);
            
            io.to(opponent.socketId).emit("search opponent:opponent found",{room, type:"multiplayer", opponent: username, currentPlayer, opponentTrophies:trophies});
            io.to(socket.id).emit("search opponent:opponent found", {room, type:"multiplayer", opponent: opponent.username, currentPlayer, opponentTrophies:opponent.trophies});
            return;
        }

        await SearchUserService.addSearchUser({ socketId: socket.id, trophies, username });
    });
}