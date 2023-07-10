import React, { forwardRef, ForwardedRef } from 'react'
import GameBoardRows from './GameBoardRows';
import BoardSquareState from '../../../../types/BoardSquareState';


type Props = {
    isGameStarted:boolean,
    boardSquares:BoardSquareState[],
    boardSquareClickHandler?:((id: number) => (event: React.MouseEvent<Element, MouseEvent>) => void)

}
export default  forwardRef(function GameBoard({  isGameStarted, boardSquares, boardSquareClickHandler }: Props, ref: ForwardedRef<HTMLTableElement> | undefined)  {

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
                <GameBoardRows isGameStarted={isGameStarted} boardSquares={boardSquares} boardSquareClickHandler={boardSquareClickHandler}/>
            </table>
        </div>
    )
});

