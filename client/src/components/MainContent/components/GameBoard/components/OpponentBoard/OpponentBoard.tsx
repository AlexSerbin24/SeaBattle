import React, { useState } from 'react'
import Game from '../../../../../../types/Game'
import BotBoard from './BotBoard'
import MultiplayerBoard from './MultiplayerBoard'
import BoardSquareState from '../../../../../../types/BoardSquareState'
import BoardSquareStatus from '../../../../../../types/BoardSquareStatus'

type Props = {
    game: Game,
    username:string,
    changeCurrentPlayer: (nextMovePlayer: string) => void,
    finishGame: (winner:string, userTrophies?: number, opponentTrophies?: number) => void,
}

export default function OpponentBoard({ game, username, changeCurrentPlayer, finishGame }: Props) {
    const [boardSquares, setBoardSquares] = useState<BoardSquareState[]>(Array.from({ length: 100 }, (_, index) => ({ id: index, status: "default" })));

    /**
     * Update border square status with certain id
     * @param id Border square id
     * @param status Border sqaure new status ("struck" or "missed")
     */
    function updateBorderSquareById(id:number, status:BoardSquareStatus){
        setBoardSquares((prevState=>prevState.map(boardSquare=>boardSquare.id == id? {...boardSquare,status}:boardSquare )));
    }

    function destroyOpponentShip(boardSquaresIdsAroundShip:number[]){
        setBoardSquares((prevState=>prevState.map(boardSquare=>boardSquaresIdsAroundShip.includes(boardSquare.id)? {...boardSquare,status:"missed"}:boardSquare ))); 
    }
    return (
        <div>
            {
                game.gameOptions.type == "singleplayer"
                ?
                <BotBoard 
                username={username}
                opponent={game.gameOptions.opponent} 
                opponentTrophies={game.gameOptions.opponentTrophies} 
                changeCurrentPlayer={changeCurrentPlayer}
                finishGame={finishGame}
                boardSquares={boardSquares}
                updateBorderSquareById={updateBorderSquareById}
                destroyOpponentShip={destroyOpponentShip}/>
                :
                <MultiplayerBoard 
                room={game.gameOptions.room} 
                opponent={game.gameOptions.opponent} 
                opponentTrophies={game.gameOptions.opponentTrophies} 
                boardSquares={boardSquares}
                updateBorderSquareById={updateBorderSquareById}
                destroyOpponentShip={destroyOpponentShip}/>
            }
        </div>
    )
}
