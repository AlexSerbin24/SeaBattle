import React, { useEffect } from 'react'
import BoardSquareState from '../../../../../types/BoardSquareState';
import useSocket from '../../../../../hooks/useSocket';
import BoardSquareStatus from '../../../../../types/BoardSquareStatus';

type Props = {
    id: number,
    status: BoardSquareStatus,
    isEnemyField: boolean,
    isGameStarted: boolean,
    room:string
}

export default function BoardSquare({ id, status, isGameStarted, room, isEnemyField }: Props) {
    const socket = useSocket();

    const borderSquareContentClasses = ["board-square-content"];

    if (!isGameStarted) {
        borderSquareContentClasses.push("invisible")
    }

    switch (status) {
        case "missed":
            borderSquareContentClasses.push("missed");
            break;
        case "struck":
            borderSquareContentClasses.push("struck");
            break;
    }

    const boardSquareClickHandler = isEnemyField && status =="default" ? (event: React.MouseEvent) => {
        socket.sendMessage("game:player move", room, id)

    } : undefined;

    return (
        <td className='board-square'>
            <div className={borderSquareContentClasses.join(' ')} onClick={boardSquareClickHandler}></div>
        </td>
    )
}
