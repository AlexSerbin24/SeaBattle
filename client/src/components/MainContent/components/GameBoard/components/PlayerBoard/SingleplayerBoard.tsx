import React, { useEffect, ForwardedRef, forwardRef } from 'react'
import GameBoard from '../../GameBoard'
import BoardSquareState from '../../../../../../types/BoardSquareState';

type Props = {
    isGameStarted: boolean,
    isGameFinished:boolean,
    boardSquares: BoardSquareState[],
    currentPlayer: string,
    username: string,
    handleOpponentMove: (boardSquareId: number) => { isHit: boolean, hittedBoardSquares: number },
    checkGameStatus: (hittedBoardSquares: number, continueGame: () => void, finishGame: () => void) => void,
    changeCurrentPlayer: (nextMovePlayer: string) => void,
    finishGame: (winner:string, userTrophies?: number, opponentTrophies?: number) => void
}

// This is a functional component for the SingleplayerBoard.
// The component is wrapped with the forwardRef function to support the forwarding of ref.
export default forwardRef(function SingleplayerBoard(
    {
        isGameStarted,
        isGameFinished,
        currentPlayer,
        username,
        boardSquares,
        handleOpponentMove,
        checkGameStatus,
        changeCurrentPlayer,
        finishGame
    }: Props,
    ref: ForwardedRef<HTMLTableElement>
) {
    useEffect(() => {
        // This useEffect handles the opponent's(bot's) move in the singleplayer game mode
        if (isGameStarted && !isGameFinished && currentPlayer !== username ) {
            // Set a timeout to simulate opponent's move delay
            const clearTimeoutId = setTimeout(() => {
                // Get available board squares that have "default" status
                const defaultBoardSquares = boardSquares.filter(boardSquare => boardSquare.status === "default");
                // Randomly select a board square
                const randomIndex = Math.round(Math.random() * (defaultBoardSquares.length - 1));
                const randomBoardSquareId = defaultBoardSquares[randomIndex].id;

                // Handle opponent's move and get the result
                const { isHit, hittedBoardSquares } = handleOpponentMove(randomBoardSquareId);

                // Determine the next move player based on the result
                const nextMovePlayer = isHit ? currentPlayer : username;

                // Check the game status and continue or finish the game accordingly
                checkGameStatus(hittedBoardSquares, () => changeCurrentPlayer(nextMovePlayer), () => finishGame(currentPlayer));
            }, 500);

            // Clean up the timeout when the component unmounts or the conditions change
            return () => {
                clearTimeout(clearTimeoutId);
            };
        }
    }, [isGameStarted, isGameFinished, currentPlayer, boardSquares]);

    return (
        <GameBoard ref={ref} isGameStarted={isGameStarted} boardSquares={boardSquares} />
    );
});
