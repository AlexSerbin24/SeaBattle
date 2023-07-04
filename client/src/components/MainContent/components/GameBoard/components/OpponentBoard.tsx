import React, { useState, useEffect } from 'react';
import GameBoard from '../GameBoard';
import Game from '../../../../../types/Game';
import BoardSquareState from '../../../../../types/BoardSquareState';
import useSocket from '../../../../../hooks/useSocket';
import BoardSquareStatus from '../../../../../types/BoardSquareStatus';

type Props = {
    game: Game
}

export default function OpponentBoard({ game }: Props) {
    const socket = useSocket();
    const [boardSquares, setBoardSquares] = useState<BoardSquareState[]>(Array.from({ length: 100 }, (_, index) => ({ id: index, status: "default" })));

    useEffect(() => {
        // Function to handle player move finished message
        function playerFinishMove(boardSquareId: number, isHit: boolean) {
            const status: BoardSquareStatus = isHit ? "struck" : "missed";
            setBoardSquares((prevState) => {
                return prevState.map(boardSquare => 
                    boardSquare.id === boardSquareId ? { ...boardSquare, status } : boardSquare
                );
            });
        }

        // Register the socket event listener when component mounts
        socket.onMessage("game:player move finished(client)", playerFinishMove);

        // Clean up the socket event listener when component unmounts
        return () => {
            socket.offMessage("game:player move finished(client)", playerFinishMove);
        };
    }, []);

    return (
        <div>
            <GameBoard isEnemyField={true} isGameStarted={true} boardSquares={boardSquares} room={game.gameOptions?.room as string} />
            <h3 style={{ textAlign: "center" }}>{game.gameOptions?.opponent}</h3>
            <h3 style={{ textAlign: "center" }}>Trophies: {game.gameOptions?.opponentTrophies}</h3>
        </div>
    );
}
