import http from "http";
import { Server } from "socket.io";
import registerSearchPlayerHandlers from "./handlers/searchPlayerHandler";
import registerGameHandlers from "./handlers/gameHandlers";
import SearchUserService from "../services/searchService";
import UserService from "../services/userService";
import TokenService from "../services/tokenService";

/**
 * Set up WebSocket connections and event handlers.
 */
export default function websocketSetup(server: http.Server) {

    // Create a new Socket.IO server instance and configure CORS.
    const io = new Server(server, { cors: { origin: process.env.FRONTEND_URL } });

    // Event handler for new client connections.
    io.on('connection', (socket) => {

        // Emit current user online count to the connected client.
        // Register event handlers for game-related events.
        registerSearchPlayerHandlers(io, socket);
        registerGameHandlers(io, socket);

        // Event handler for client disconnections.
        socket.on("disconnect", async () => {
            if (socket.handshake.headers.authorization) {
                // Retrieve the username associated with the disconnected socket.
                const username = await SearchUserService.getUsernameBySocket(socket.id);

                // If a username is found, remove the user from search and update their status.
                if (username) {
                    await Promise.all([
                        SearchUserService.removeSearchUser(socket.id),
                        UserService.updateUserBlockSearchGame(username, false)
                    ]);
                }

            }
        });
    });
}
