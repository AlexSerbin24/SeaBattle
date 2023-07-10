import React, { useState, useEffect } from 'react';
import GameBoard from '../../GameBoard';
import Game from '../../../../../../types/Game';
import BoardSquareState from '../../../../../../types/BoardSquareState';
import useSocket from '../../../../../../hooks/useSocket';
import BoardSquareStatus from '../../../../../../types/BoardSquareStatus';
import PlayerInfo from '../PlayerInfo';

type Props = {
    room:string,
    boardSquares: BoardSquareState[],
    opponent:string,
    opponentTrophies:number,
    updateBorderSquareById:(id: number, status: BoardSquareStatus)=>void
}

export default function MultiplayerBoard({ room, boardSquares, opponent, opponentTrophies,updateBorderSquareById }: Props) {
    const socket = useSocket();

    /**
     * Function that returns function handling click on border square with certain id
     * @param id Border square id
     * @returns Function that handling click on border square
     */
    const boardSquareClickHandler = (id: number) => {
        return (event: React.MouseEvent<Element, MouseEvent>) => {
            socket.sendMessage("game:player move", room, id)
        }
    }


    //Opponent board always will be if isGameStarted equals true
    useEffect(() => {
        // Function to handle player move finished message
        const playerFinishMove = (boardSquareId: number, isHit: boolean) => {
            const status: BoardSquareStatus = isHit ? "struck" : "missed";
            updateBorderSquareById(boardSquareId, status);
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
            <GameBoard isGameStarted={true} boardSquares={boardSquares} boardSquareClickHandler={boardSquareClickHandler}/>
            <PlayerInfo playername={opponent} trophies={opponentTrophies} />
        </div>
    );
}
