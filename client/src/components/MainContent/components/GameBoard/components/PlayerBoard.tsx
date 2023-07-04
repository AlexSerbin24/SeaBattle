import React, { useState, useRef, useEffect } from 'react';
import useSocket from '../../../../../hooks/useSocket';
import GameBoard from '../GameBoard';
import ShipPlacements from '../../ShipPlacement/ShipPlacements';
import Button from '../../../../UI/Button/Button';
import ShipsState from '../../../../../types/ShipsState';
import Ship from '../../../../../types/Ship';
import {
    getLargeShipsDefaultCoordinates,
    getMediumShipsDefaultCoordinates,
    getSmallShipsDefaultCoordinates,
    getTinyShipsDefaultCoordinates
} from '../../../../../utils/shipsDefaultProperties';
import Ships from '../../Ships/Ships';
import UpdatedShip from '../../../../../types/UpdatedShip';
import Game from '../../../../../types/Game';
import BoardSquareState from '../../../../../types/BoardSquareState';
import BoardSquareStatus from '../../../../../types/BoardSquareStatus';
import GameOptions from '../../../../../types/GameOptions';

type Props = {
    game: Game;
    isEditMode: boolean;
    username: string | undefined;
    trophies: number | undefined;
    setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>;
    editShipsButtonClickHandler: ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void);
};

export default function PlayerBoard({ game, isEditMode, username, trophies, setIsEditMode, editShipsButtonClickHandler }: Props) {
    const socket = useSocket();
    const gameBoardRef = useRef<HTMLTableElement>(null);
    const [boardSquares, setBoardSquares] = useState<BoardSquareState[]>(Array.from({ length: 100 }, (_, index) => ({ id: index, status: "default" })));
    const [ships, setShips] = useState<ShipsState>({
        // Initial state for ships
        largeShips: [
            { id: 1, coordinates: { x: 0, y: 0 }, placement: { x: 0, y: 0 }, isRotated: false }
        ],
        mediumShips: [
            { id: 2, coordinates: { x: 0, y: 0 }, placement: { x: 0, y: 0 }, isRotated: false },
            { id: 3, coordinates: { x: 0, y: 0 }, placement: { x: 0, y: 0 }, isRotated: false }
        ],
        smallShips: [
            { id: 4, coordinates: { x: 0, y: 0 }, placement: { x: 0, y: 0 }, isRotated: false },
            { id: 5, coordinates: { x: 0, y: 0 }, placement: { x: 0, y: 0 }, isRotated: false },
            { id: 6, coordinates: { x: 0, y: 0 }, placement: { x: 0, y: 0 }, isRotated: false }
        ],
        tinyShips: [
            { id: 7, coordinates: { x: 0, y: 0 }, placement: { x: 0, y: 0 }, isRotated: false },
            { id: 8, coordinates: { x: 0, y: 0 }, placement: { x: 0, y: 0 }, isRotated: false },
            { id: 9, coordinates: { x: 0, y: 0 }, placement: { x: 0, y: 0 }, isRotated: false },
            { id: 10, coordinates: { x: 0, y: 0 }, placement: { x: 0, y: 0 }, isRotated: false }
        ]
    });

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

    useEffect(() => {
        // This useEffect handles the opponent's move and updates the game state accordingly
        function opponentMove(borderSquareId: number) {
            const gameBoard = gameBoardRef.current;
            if (gameBoard) {
                const boardSquaresBlocks = gameBoard.querySelectorAll("td");
                const boardSquareBlock = boardSquaresBlocks[borderSquareId];
                const { x, y } = boardSquareBlock.getBoundingClientRect();
                const targetElements = document.elementsFromPoint(x + 22.5, y + 23 + window.scrollY);
                const ship = targetElements.find(el => el.classList.contains("ship"));

                const status: BoardSquareStatus = ship ? "struck" : "missed";
                console.log(boardSquares);
                const hittedBoardSquares = ship ?
                    boardSquares.filter(boardSquare => boardSquare.status === "struck").length + 1
                    :
                    boardSquares.filter(boardSquare => boardSquare.status === "struck").length;

                setBoardSquares((prevState) =>
                    prevState.map(boardSquare =>
                        boardSquare.id === borderSquareId ? { ...boardSquare, status } : boardSquare
                    )
                );

                const { room, currentPlayer, opponentTrophies } = game.gameOptions as GameOptions;
                const isHit = status === "struck";
                // Notify the opponent that the move has finished
                socket.sendMessage("game:player move finished", room, borderSquareId, isHit);
                console.log(hittedBoardSquares);
                // Check if the game is over or change the current player
                hittedBoardSquares !== 20
                    ? socket.sendMessage("game:change current player", room, isHit, currentPlayer, username)
                    : socket.sendMessage("game:game over", room, currentPlayer, opponentTrophies, username, trophies);
            }
        }

        // Register socket event listener for opponent move messages
        socket.onMessage("game:player move(client)", opponentMove);

        // Clean up the socket event listener when the component unmounts
        return () => {
            socket.offMessage("game:player move(client)", opponentMove);
        };
    }, [game.isGameStarted, game.gameOptions?.currentPlayer, boardSquares]);

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
        <>
            <Ships isEditMode={isEditMode} allowedShips={ships} isGameStarted={game.isGameStarted} updateShip={updateShipById} />
            <GameBoard
                ref={gameBoardRef}
                isEnemyField={false}
                isGameStarted={game.isGameStarted}
                room={game.gameOptions?.room as string}
                boardSquares={boardSquares}
            />

            {!game.isGameStarted ? (
                isEditMode ? (
                    <ShipPlacements allowedShips={ships} updateShip={updateShipById} setEditMode={setIsEditMode} />
                ) : (
                    <Button onClick={editShipsButtonClickHandler} className='edit-ships-btn'>
                        Edit ships placements
                    </Button>
                )
            ) : (
                <>
                    <h3 style={{ textAlign: "center" }}>{username ? username : "unknown"}</h3>
                    <h3 style={{ textAlign: "center" }}>Trophies: {trophies ? trophies : 0}</h3>
                </>
            )}
        </>
    );
}
