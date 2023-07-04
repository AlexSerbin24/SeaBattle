import React, { forwardRef, ForwardedRef, useState, useEffect } from 'react'
import BoardSquare from './components/BoardSquare';
import BoardSquareState from '../../../../types/BoardSquareState';


type Props = {
    isEnemyField: boolean,
    isGameStarted: boolean,
    room:string
    boardSquares:BoardSquareState[],
}
const GameBoard = forwardRef(({ isEnemyField, isGameStarted, room, boardSquares }: Props, ref: ForwardedRef<HTMLTableElement> | undefined) => {
    const boardLines = Array.from({ length: 10 }, (r, rowIndex) =>
        <tr key={`row${rowIndex}`} className='board-row'>
            {
                <>
                    <th>{rowIndex + 1}</th>
                    {
                        Array.from({ length: 10 }, (c, columnIndex) =>
                            <BoardSquare key={`${rowIndex};${columnIndex}`}
                                id={(10 * rowIndex) + columnIndex}
                                isGameStarted={isGameStarted}
                                isEnemyField={isEnemyField}
                                room={room}
                                status={boardSquares[(10*rowIndex) + columnIndex].status}/>
                        )
                    }
                </>
            }
        </tr>
    );

    return (
        <div>
            <table ref={ref} className='board'>
                <tr>
                    <th></th>
                    <th>A</th>
                    <th>B</th>
                    <th>C</th>
                    <th>D</th>
                    <th>E</th>
                    <th>F</th>
                    <th>G</th>
                    <th>H</th>
                    <th>I</th>
                    <th>J</th>
                </tr>
                {boardLines}
            </table>
        </div>
    )
});

export default GameBoard;