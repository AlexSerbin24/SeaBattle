import React, { useEffect } from 'react'
import BoardSquare from './components/BoardSquare'
import BoardSquareState from '../../../../types/BoardSquareState'

type Props = {
    isGameStarted:boolean,
    boardSquares: BoardSquareState[],
    boardSquareClickHandler?: (id: number) => (event: React.MouseEvent<Element, MouseEvent>) => void
}
export default function GameBoardRows({ isGameStarted, boardSquares, boardSquareClickHandler }: Props) {
    useEffect(() => {
        
    }, [boardSquares])
    
 
    const boardLines = Array.from({ length: 10 }, (r, rowIndex) =>
        <tr key={`row${rowIndex}`} className='board-row'>
            {
                <>
                    <th>{rowIndex + 1}</th>
                    {
                        Array.from({ length: 10 }, (c, columnIndex) =>
                            <BoardSquare key={`${rowIndex};${columnIndex}`}
                                isGameStarted={isGameStarted}
                                boardSquareClickHandler={boardSquareClickHandler? boardSquareClickHandler((10 * rowIndex) + columnIndex) : undefined}
                                status={boardSquares[(10 * rowIndex) + columnIndex].status} />
                        )
                    }
                </>
            }
        </tr>
    );
    return (
        <>
            {boardLines}
        </>
    )
}
