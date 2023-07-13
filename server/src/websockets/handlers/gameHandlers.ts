import { Server, Socket } from "socket.io";
import UserService from "../../services/userService.js";

export default function registerGameHandlers(io: Server, socket: Socket) {
    // socket.on("game:player ready", (room: string, username: string) => {
    //     io.to(room).emit("game:player ready(client)", { username, ready: true });
    // });

    // socket.on("game:start", (room: string, playerNames: string[]) => {
    //     const firstPlayerIndex = Math.floor(Math.random() * playerNames.length);
    //     const firstPlayerName = playerNames[firstPlayerIndex];

    //     io.to(room).emit("game:start(client)", firstPlayerName);
    // });

    //не учитываются бонусы(разведка, ковровая бомбардировка и точечный удар)
    socket.on("game:player move", (room: string, boardSquareId: number) => {
        socket.broadcast.to(room).emit("game:player move(client)", boardSquareId);
    });

    socket.on("game:player move finished", (room: string, boardSquareId: number, isHit: boolean, boardSquaresIdsAroundShip:number[]) => {
        socket.broadcast.to(room).emit("game:player move finished(client)", boardSquareId, isHit,boardSquaresIdsAroundShip);
    });

    socket.on("game:change current player", (room: string, isHit: boolean, currentPlayerName: string, waitingPlayerName: string) => {
        const nextMovePlayer = isHit ? currentPlayerName : waitingPlayerName;
        io.to(room).emit("game:change current player", nextMovePlayer);
    })

    socket.on("game:game over", async (room: string, winnerName: string, winnerTrophies: number, loserName: string, loserTrophies: number) => {
        // const trophiesDifference = Math.abs(winnerTrophies - loserTrophies);
        const trophiesChange = 5;

        await UserService.updateUserTrophies(winnerName, trophiesChange);

        if (loserTrophies >= trophiesChange)
            await UserService.updateUserTrophies(loserName, -trophiesChange);
        else
            await UserService.updateUserTrophies(loserName, -loserTrophies);

        io.to(room).emit("game:game over", winnerTrophies + trophiesChange, loserTrophies >= trophiesChange ? loserTrophies - trophiesChange : 0);

        io.socketsLeave(room);
        io.sockets.adapter.rooms.delete(room);
    })

}