import React, { ForwardedRef, forwardRef, useEffect } from 'react'
import GameBoard from '../../GameBoard';
import useSocket from '../../../../../../hooks/useSocket';
import BoardSquareState from '../../../../../../types/BoardSquareState';
import GameOptions from '../../../../../../types/GameOptions';


// Multiplayer player board  always has isGameStarted true
type Props = {
    isGameFinished: boolean,
    gameOptions: GameOptions,
    boardSquares: BoardSquareState[],
    username: string,
    trophies: number,
    handleOpponentMove: (boardSquareId: number) => { isHit: boolean, hittedBoardSquares: number, boardSquaresIdsAroundShip: number[] },
    checkGameStatus: (hittedBoardSquares: number, continueGame: () => void, finishGame: () => void) => void,
    changeCurrentPlayer: (nextMovePlayer: string) => void,
    finishGame: (winner: string, userTrophies?: number, opponentTrophies?: number) => void
}


export default forwardRef(function MultiplayerBoard({ isGameFinished, gameOptions, boardSquares, username, trophies, handleOpponentMove, checkGameStatus, changeCurrentPlayer, finishGame }: Props, ref: ForwardedRef<HTMLTableElement>) {
    const socket = useSocket();
    useEffect(() => {
        const changingCurrentPlayer = (nextMovePlayer: string) => {
            changeCurrentPlayer(nextMovePlayer);
        };


        const gameOver = (winner: string, winnerTrophies: number, loserTrophies: number) => {
            // Update user trophies based on the game result
            const [userTrophies, opponentTrophies] =
                username === winner
                    ? [winnerTrophies, loserTrophies]
                    : [loserTrophies, winnerTrophies];
            finishGame(winner, userTrophies, opponentTrophies);
        };


        const opponentMove = (borderSquareId: number) => {
            const { isHit, hittedBoardSquares, boardSquaresIdsAroundShip } = handleOpponentMove(borderSquareId);

            const { room, currentPlayer, opponentTrophies } = gameOptions;
            // Notify the opponent that the move has finished
            socket.sendMessage("game:player move finished", room, borderSquareId, isHit, boardSquaresIdsAroundShip);
            // Check if the game is over or change the current player
            checkGameStatus(hittedBoardSquares,
                () => socket.sendMessage("game:change current player", room, isHit, currentPlayer, username),
                () => socket.sendMessage("game:game over", room, currentPlayer, opponentTrophies, username, trophies));


        }

        // Register socket event listener for game events
        socket.onMessage("game:change current player", changingCurrentPlayer);
        socket.onMessage("game:game over", gameOver);
        socket.onMessage("game:player move(client)", opponentMove);

        // Clean up the socket event listener when the component unmounts
        return () => {
            socket.offMessage("game:change current player", changingCurrentPlayer);
            socket.offMessage("game:game over", gameOver);
            socket.offMessage("game:player move(client)", opponentMove);
        };
    }, [gameOptions.currentPlayer, boardSquares])

    useEffect(() => {

        if (!isGameFinished) {
            console.log(gameOptions)
            const beforeUnloadEventHandler = (event: BeforeUnloadEvent) => {
                const confirmationMessage = `Are you sure you want to leave while game is continuing?`;
                event.returnValue = confirmationMessage;
            }
            const unloadEventHandler = (event: Event) => {
                const { room, opponent, opponentTrophies } = gameOptions;

                socket.sendMessage("game:game over", room, opponent, opponentTrophies, username, trophies)
            }
            window.addEventListener("beforeunload", beforeUnloadEventHandler);
            window.addEventListener('unload', unloadEventHandler);
            return () => {
                window.removeEventListener("beforeunload", beforeUnloadEventHandler);
                window.removeEventListener("unload", unloadEventHandler);
            }
        }
    }, [gameOptions, isGameFinished])


    return (
        <GameBoard ref={ref} isGameStarted={true} boardSquares={boardSquares} />
    )
})

