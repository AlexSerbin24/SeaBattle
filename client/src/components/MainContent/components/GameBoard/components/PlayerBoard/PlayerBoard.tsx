import React, { useState, useRef, useEffect } from 'react';
import PlayerInfo from '../PlayerInfo';
import ShipsState from '../../../../../../types/ShipsState';
import Ship from '../../../../../../types/Ship';
import {
    getLargeShipsDefaultCoordinates,
    getMediumShipsDefaultCoordinates,
    getSmallShipsDefaultCoordinates,
    getTinyShipsDefaultCoordinates
} from '../../../../../../utils/shipsDefaultProperties';
import getDestroyedShipBoardSquaresAround from '../../../../../../utils/getDestroyedShipBoardSquaresAround';
import Ships from '../../../Ships/Ships';
import UpdatedShip from '../../../../../../types/UpdatedShip';
import Game from '../../../../../../types/Game';
import BoardSquareState from '../../../../../../types/BoardSquareState';
import BoardSquareStatus from '../../../../../../types/BoardSquareStatus';
import EditShipsPanel from '../EditShipsPanel';
import SingleplayerBoard from './SingleplayerBoard';
import MultiplayerBoard from './MultiplayerBoard';
import isShipDestroyed from '../../../../../../utils/isShipDestroyed';


type Props = {
    game: Game;
    isEditMode: boolean;
    username: string,
    trophies: number,
    changeCurrentPlayer: (nextMovePlayer: string) => void,
    finishGame: (userTrophies?: number, opponentTrophies?: number) => void,
    setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>;
    editShipsButtonClickHandler: ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void);
};

export default function PlayerBoard({ game, isEditMode, username, trophies, setIsEditMode, changeCurrentPlayer, finishGame, editShipsButtonClickHandler }: Props) {
    const gameBoardRef = useRef<HTMLTableElement>(null);
    const defaultPlayerBoardSquares: BoardSquareState[] = Array.from({ length: 100 }, (_, index) => ({ id: index, status: "default" }));
    const [boardSquares, setBoardSquares] = useState<BoardSquareState[]>(defaultPlayerBoardSquares);
    const [ships, setShips] = useState<ShipsState>({
        // Initial state for ships
        largeShips: [
            { id: 1, coordinates: { x: 0, y: 0 }, placement: { x: 0, y: 0 }, isRotated: false, boardSquaresIds: [] }
        ],
        mediumShips: [
            { id: 2, coordinates: { x: 0, y: 0 }, placement: { x: 0, y: 0 }, isRotated: false, boardSquaresIds: [] },
            { id: 3, coordinates: { x: 0, y: 0 }, placement: { x: 0, y: 0 }, isRotated: false, boardSquaresIds: [] }
        ],
        smallShips: [
            { id: 4, coordinates: { x: 0, y: 0 }, placement: { x: 0, y: 0 }, isRotated: false, boardSquaresIds: [] },
            { id: 5, coordinates: { x: 0, y: 0 }, placement: { x: 0, y: 0 }, isRotated: false, boardSquaresIds: [] },
            { id: 6, coordinates: { x: 0, y: 0 }, placement: { x: 0, y: 0 }, isRotated: false, boardSquaresIds: [] }
        ],
        tinyShips: [
            { id: 7, coordinates: { x: 0, y: 0 }, placement: { x: 0, y: 0 }, isRotated: false, boardSquaresIds: [] },
            { id: 8, coordinates: { x: 0, y: 0 }, placement: { x: 0, y: 0 }, isRotated: false, boardSquaresIds: [] },
            { id: 9, coordinates: { x: 0, y: 0 }, placement: { x: 0, y: 0 }, isRotated: false, boardSquaresIds: [] },
            { id: 10, coordinates: { x: 0, y: 0 }, placement: { x: 0, y: 0 }, isRotated: false, boardSquaresIds: [] }
        ]
    });

    /** 
    * Function for hadnling opponent move in singleplayer and multiplayer. 
    * @param boardSquareId The board square that will be handle.
    * @returns Object with "isHit", "hittedBoardSquares" and "boardSquaresIdsAroundShip" properties.
    * First property explains whether opponent hit ship block or not.
    * Second property explains how many blocks was hitted.
    * Third property uses for multiplayer mode for showing eliminating of ship
    */
    function handleOpponentMove(boardSquareId: number) {
        let hittedBoardSquares = boardSquares.filter(boardSquare => boardSquare.status === "struck").length
        let isDestroyed = false;

        let boardSquaresIds: number[] = []
        for (const key in ships) {
            const shipType = key as keyof ShipsState;
            boardSquaresIds = [...boardSquaresIds, ...ships[shipType].map(ship => ship.boardSquaresIds)].flat();
        }
        const status: BoardSquareStatus = boardSquaresIds.includes(boardSquareId) ? "struck" : "missed";

        setBoardSquares((prevState) => prevState.map(boardSquare => boardSquare.id == boardSquareId ? { ...boardSquare, status } : boardSquare));

        let boardSquaresIdsAroundShip: number[] = [];
        if (status == "struck") {
            hittedBoardSquares++;
            const { isRotated, boardSquaresIds: shipBoardSquares } = (Object.values(ships).flat())
                .find((ship:Ship) => ship.boardSquaresIds.some((id) => id === boardSquareId)) as Ship;

            isDestroyed = isShipDestroyed(boardSquares, shipBoardSquares, boardSquareId);

            if (isDestroyed) {
                boardSquaresIdsAroundShip = getDestroyedShipBoardSquaresAround(shipBoardSquares, isRotated);
                setBoardSquares((prevState) => prevState.map(boardSquare => boardSquaresIdsAroundShip.includes(boardSquare.id) ? { ...boardSquare, status: "missed" } : boardSquare));
            }
        };

        
        return { isHit: status == "struck", hittedBoardSquares, boardSquaresIdsAroundShip }
    }
    /**
     * Checks the game status based on the number of hitted board squares.
     * If the number of hitted board squares is not equal to 20, it continues the game by calling the "continueGame" function.
     * If the number of hitted board squares is equal to 20, it finishes the game by calling the "finishGame" function.
     * @param hittedBoardSquares The number of hitted board squares.
     * @param continueGame The function to be called to continue the game.
     * @param finishGame The function to be called to finish the game.
     */
    function checkGameStatus(hittedBoardSquares: number, continueGame: () => void, finishGame: () => void) {
        hittedBoardSquares != 20 ? continueGame() : finishGame();
    }

    useEffect(() => {
        // This useEffect is called once when the component mounts
        // It sets up the initial ship coordinates based on the game board
        const gameBoard = gameBoardRef.current;
        if (gameBoard) {
            const boardSquaresBlocks = gameBoard.querySelectorAll("td");
            setShips((prevState) => {
                const updatedShips = { ...prevState };
                for (const key in updatedShips) {
                    const shipType = key as keyof ShipsState;

                    let resultArr: Omit<Ship, "id">[] = [];
                    switch (shipType) {
                        case "largeShips":
                            resultArr = getLargeShipsDefaultCoordinates(boardSquaresBlocks);
                            break;
                        case "mediumShips":
                            resultArr = getMediumShipsDefaultCoordinates(boardSquaresBlocks);
                            break;
                        case 'smallShips':
                            resultArr = getSmallShipsDefaultCoordinates(boardSquaresBlocks);
                            break;
                        case 'tinyShips':
                            resultArr = getTinyShipsDefaultCoordinates(boardSquaresBlocks);
                            break;
                    }

                    updatedShips[shipType] = updatedShips[shipType].map((ship, index) => {
                        const defaultProps = resultArr[index];
                        return { ...ship, ...defaultProps };
                    });
                }
                return updatedShips;
            });
        }
    }, []);

    //If game is closed set board squares to default state
    useEffect(() => {
        if (!game.isGameFinished) {
            setBoardSquares(defaultPlayerBoardSquares);
        }
    }, [game.isGameFinished])


    /**Function for update ship by id 
     * Update ship by if and set state
     * @param id The ship id
     * @param data New ship properties values
    */
    function updateShipById(id: number, data: UpdatedShip) {
        setShips((prevState) => {
            const updatedShips = { ...prevState };
            for (const key in updatedShips) {
                const shipType = key as keyof ShipsState;
                updatedShips[shipType] = updatedShips[shipType].map(ship =>
                    ship.id === id ? { ...ship, ...data } : ship
                );
            }
            return updatedShips;
        });
    }



    return (
        <div>
            <Ships isEditMode={isEditMode} allowedShips={ships} isGameStarted={game.isGameStarted} updateShip={updateShipById}  gameBoardRef={gameBoardRef}/>
            {
                game.gameOptions.type == "singleplayer"
                    ?
                    <SingleplayerBoard
                        ref={gameBoardRef}
                        isGameStarted={game.isGameStarted}
                        username={username}
                        currentPlayer={game.gameOptions.currentPlayer}
                        boardSquares={boardSquares}
                        handleOpponentMove={handleOpponentMove}
                        checkGameStatus={checkGameStatus}
                        changeCurrentPlayer={changeCurrentPlayer}
                        finishGame={finishGame} />
                    :
                    <MultiplayerBoard
                        ref={gameBoardRef}
                        gameOptions={game.gameOptions}
                        username={username}
                        trophies={trophies}
                        boardSquares={boardSquares}
                        handleOpponentMove={handleOpponentMove}
                        checkGameStatus={checkGameStatus}
                        changeCurrentPlayer={changeCurrentPlayer}
                        finishGame={finishGame} />
            }

            {!game.isGameStarted ?
                <EditShipsPanel
                    isEditMode={isEditMode}
                    ships={ships}
                    updateShipById={updateShipById}
                    editShipsButtonClickHandler={editShipsButtonClickHandler}
                    setIsEditMode={setIsEditMode} />
                :
                <PlayerInfo playername={username} trophies={trophies} />
            }
        </div>
    );
}
