import React, { useState } from 'react'
import GameBoard from '../../GameBoard';
import PlayerInfo from '../PlayerInfo';
import BoardSquareState from '../../../../../../types/BoardSquareState';
import generateBotShipsPlacements from '../../../../../../utils/generateBotShipsPlacements';
import BoardSquareStatus from '../../../../../../types/BoardSquareStatus';

type Props = {
    boardSquares: BoardSquareState[],
    opponent:string,
    opponentTrophies:number,
    updateBorderSquareById:(id: number, status: BoardSquareStatus)=>void,
    changeCurrentPlayer: (nextMovePlayer: string) => void,
    finishGame: (userTrophies?: number, opponentTrophies?: number) => void
}
export default function BotBoard({boardSquares, opponent,opponentTrophies, updateBorderSquareById,  changeCurrentPlayer, finishGame}:Props) {

    const [botShips] = useState(generateBotShipsPlacements());
    console.log(botShips)

    /**
     * Function that returns function handling click on border square with certain id
     * @param id Border square id
     * @returns Function that handling click on border square
     */
    const boardSquareClickHandler = (id: number) => {
        return (event: React.MouseEvent<Element, MouseEvent>) => {
            //Get current hittedBoardSquares (before update)
            let hittedBoardSquares = boardSquares.filter(boardSquare=>boardSquare.status =="struck").length;

            //Set status according to inclusion in array
            const status:BoardSquareStatus = botShips.includes(id) ? "struck":"missed";

            //Update border square status
            updateBorderSquareById(id, status);

            //If status is "missed" change current player to Bot
            if(status=="missed"){
                changeCurrentPlayer(opponent);
                return;
            }

            //If status is "struck" hittedBoardSquares should increment
            hittedBoardSquares++; 

            //Finish game if hittedBoardSquares equal 20
            if(hittedBoardSquares == 20) finishGame();
            

        }
    }
    return (
        <div>
            <GameBoard  isGameStarted={true}  boardSquares={boardSquares} boardSquareClickHandler={boardSquareClickHandler}/>
            <PlayerInfo playername={opponent} trophies={opponentTrophies} />
        </div>
    );
}
