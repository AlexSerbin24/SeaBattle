import React from 'react'
import BoardSquareStatus from '../../../../../types/BoardSquareStatus';

type Props = {
    isGameStarted: boolean,
    status: BoardSquareStatus,
    boardSquareClickHandler?: (event: React.MouseEvent) => void
}

export default function BoardSquare({ isGameStarted, status, boardSquareClickHandler }: Props) {
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


    return (
        <td  className='board-square'>
            <div className={borderSquareContentClasses.join(' ')} onClick={status == "default" ? boardSquareClickHandler : undefined}></div>
        </td>
    )
}
