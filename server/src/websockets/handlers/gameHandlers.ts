import { Server, Socket } from "socket.io";
import UserService from "../../services/userService";

/**
 * Register event handlers related to the game interactions.
 */
export default function registerGameHandlers(io: Server, socket: Socket) {

    /**
     * Handle the event when a player makes a move on the game board.
     */
    socket.on("game:player move", (room: string, boardSquareId: number) => {
        socket.broadcast.to(room).emit("game:player move(client)", boardSquareId);
    });

    /**
     * Handle the event when a player's move is finished.
     */
    socket.on("game:player move finished", (room: string, boardSquareId: number, isHit: boolean, boardSquaresIdsAroundShip: number[]) => {
        socket.broadcast.to(room).emit("game:player move finished(client)", boardSquareId, isHit, boardSquaresIdsAroundShip);
    });

    /**
     * Handle the event when the current player is changed in the game.
     */
    socket.on("game:change current player", (room: string, isHit: boolean, currentPlayerName: string, waitingPlayerName: string) => {
        // Determine the next move player based on the hit outcome.
        const nextMovePlayer = isHit ? currentPlayerName : waitingPlayerName;
        io.to(room).emit("game:change current player(client)", nextMovePlayer);
    });

    /**
     * Handle the event when the game is over, and determine the winner and loser.
     * Update trophies, unblock search game, and notify clients about the game result.
     */
    socket.on("game:game over", async (room: string, winnerName: string, winnerTrophies: number, loserName: string, loserTrophies: number) => {
        const trophiesChange = 5;

        // Update trophies for the winner and loser.
        await UserService.updateUserTrophies(winnerName, trophiesChange);
        if (loserTrophies >= trophiesChange)
            await UserService.updateUserTrophies(loserName, -trophiesChange);
        else
            await UserService.updateUserTrophies(loserName, -loserTrophies);

        // Unblock search game for both players.
        await Promise.all([UserService.updateUserBlockSearchGame(winnerName, false), UserService.updateUserBlockSearchGame(loserName, false)])

        // Notify clients about the game result, including updated trophy counts.
        io.to(room).emit("game:game over(client)", winnerName, winnerTrophies + trophiesChange, loserTrophies >= trophiesChange ? loserTrophies - trophiesChange : 0);

        // Remove players from the game room.
        io.socketsLeave(room);
        io.sockets.adapter.rooms.delete(room);
    });
}
