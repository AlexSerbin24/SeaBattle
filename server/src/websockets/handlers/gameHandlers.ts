import { Server, Socket } from "socket.io";

export default function registerGameHandlers(io: Server, socket: Socket) {
    socket.on("game:player ready", (room: string, username: string) => {
        io.to(room).emit("game:player ready(client)", { username, ready: true });
    });

    socket.on("game:start", (room: string, playerNames: string[]) => {
        const firstPlayerIndex = Math.floor(Math.random() * playerNames.length);
        const firstPlayerName = playerNames[firstPlayerIndex];

        io.to(room).emit("game:start(client)", firstPlayerName);
    });

    //не учитываются бонусы(разведка, ковровая бомбардировка и точечный удар)
    socket.on("game:player move", (room: string, playerName: string, coordinates: { letter: number, number: number }) => {
        io.to(room).emit("game:player move(client)", playerName, coordinates);
    });

    socket.on("game:player move finished", (room: string, isHit: boolean, currentPlayerName: string, waitingPlayerName: string) => {
        const nextMovePlayer = isHit ? currentPlayerName : waitingPlayerName;
        io.to(room).emit("game:player move finished(client)",nextMovePlayer, isHit)
    });

    socket.on("game:game over", (room:string, winnerName: string)=>{
        io.to(room).emit("game:game over", winnerName);
    })

}