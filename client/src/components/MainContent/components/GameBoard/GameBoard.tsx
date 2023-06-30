import React, { forwardRef, ForwardedRef } from 'react'


type Props = {
    isEnemyField: boolean,

}
const  GameBoard = forwardRef(({isEnemyField}:Props, ref:ForwardedRef<HTMLTableElement> )=> {
    const boardLines = Array.from({ length: 10 }, (r, rowIndex) =>
        <tr key={`row${rowIndex}`} className='board-row'>
            {
                <>
                    <th>{rowIndex + 1}</th>
                    {
                        Array.from({ length: 10 }, (c, columnIndex) =>
                            <td  className='board-square' key={`${rowIndex};${columnIndex}`}></td>
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