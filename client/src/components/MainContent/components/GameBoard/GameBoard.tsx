import React from 'react'


type Props = {
    isEnemyField: boolean,

}
export default function GameBoard({ isEnemyField }: Props) {
    const boardLines = Array.from({ length: 10 }, (r, rowIndex) =>
        <tr className='board-row'>
            {
                <>
                    <th>{rowIndex + 1}</th>
                    {
                        Array.from({ length: 10 }, (c, columnIndex) =>
                            <td className='board-square' key={`${rowIndex};${columnIndex}`}></td>
                        )
                    }
                </>
            }
        </tr>
    );

    return (
        <div>
            <table className='board'>
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
            <p style={{ textAlign: "center" }}>
                Your board.
                <br/>
                Arrange the ships that are available below.
            </p>
        </div>
    )
}
