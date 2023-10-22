import { Server, Socket } from "socket.io";
import SearchUserService from "../../services/searchService";
import SearchUserData from "../../types/searchUserData";
import TokenService from "../../services/tokenService";
import UserService from "../../services/userService";

/**
 * Register event handlers related to searching for opponents.
 */
export default function registerSearchPlayerHandlers(io: Server, socket: Socket) {
    /**
     * Handle the event when a user searches for an opponent.
     * @param {Object} userData - User data containing username and trophies.
     */
    socket.on("search opponent:searching", async ({ username, trophies }: Omit<SearchUserData, "socketId">) => {
        // Validate the user's access token before proceeding.
        const token = (socket.handshake.headers.authorization as string).split(" ")[1];
        if (!TokenService.validateAccessToken(token)) {
            socket.emit("search opponent:invalid token(client)");
            return;
        }

        // Check if the user is blocked from searching for opponents.
        if (await UserService.getUserBlockSearchStatus(username)) {
            socket.emit("search opponent:searching is blocked(client)");
            return;
        }

        // Update the user's search status to indicate they are searching for an opponent.
        await UserService.updateUserBlockSearchGame(username, true);

        // Attempt to find a suitable opponent based on trophies.
        const opponent = await SearchUserService.findSuitableOpponent(trophies);

        if (opponent) {
            // If an opponent is found, remove both users from the search pool and create a room for them.
            await SearchUserService.removeSearchUser(opponent.socketId);
            const room = `${socket.id}-${opponent.socketId}`;
            const currentPlayer = [username, opponent.username][Math.floor(Math.random() * 2)];

            // Add both users to the room and notify them about the opponent.
            const opponentSocket = io.sockets.sockets.get(opponent.socketId) as Socket;
            opponentSocket.join(room);
            socket.join(room);

            // Emit events to notify both users about the opponent found.
            io.to(opponent.socketId).emit("search opponent:opponent found(client)", {
                room,
                type: "multiplayer",
                opponent: username,
                currentPlayer,
                opponentTrophies: trophies
            });
            io.to(socket.id).emit("search opponent:opponent found(client)", {
                room,
                type: "multiplayer",
                opponent: opponent.username,
                currentPlayer,
                opponentTrophies: opponent.trophies
            });
            return;
        }

        // If no opponent is found, add the user to the search pool.
        await SearchUserService.addSearchUser({ socketId: socket.id, trophies, username });
    });
}
