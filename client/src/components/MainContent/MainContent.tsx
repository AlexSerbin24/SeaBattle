import React, { useRef, useState, useEffect } from 'react'
import Container from '../UI/Container/Container'
import GameBoard from './components/GameBoard/GameBoard'
import Menu from './components/Menu/Menu'
import ShipPlacements from './components/ShipPlacement/ShipPlacements'
import Ships from './components/Ships/Ships'
import ShipsState from '../../types/ShipsState'
import Ship from '../../types/Ship'
import Button from '../UI/Button/Button'
import {
  getLargeShipsDefaultCoordinates,
  getMediumShipsDefaultCoordinates,
  getSmallShipsDefaultCoordinates,
  getTinyShipsDefaultCoordinates
} from '../../utils/shipsDefaultProperties'

import UpdatedShip from '../../types/UpdatedShip'

export default function MainContent() {
  const gameBoardRef = useRef<HTMLTableElement>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [ships, setShips] = useState<ShipsState>({
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
    const gameBoard = gameBoardRef.current;
    if (gameBoard) {
      const shipBlocks = gameBoard.querySelectorAll("td");
      setShips((prevState) => {
        const updatedShips = { ...prevState };
        for (const key in updatedShips) {
          const shipType = key as keyof ShipsState;

          let resultArr: Omit<Ship, "id">[] = [];
          switch (shipType) {
            case "largeShips":
              resultArr = getLargeShipsDefaultCoordinates(shipBlocks);
              break;
            case "mediumShips":
              resultArr = getMediumShipsDefaultCoordinates(shipBlocks);
              break;
            case 'smallShips':
              resultArr = getSmallShipsDefaultCoordinates(shipBlocks);
              break;
            case 'tinyShips':
              resultArr = getTinyShipsDefaultCoordinates(shipBlocks);
              break;
          }

          updatedShips[shipType] = updatedShips[shipType].map((ship, index) => {
            const defaultProps = resultArr[index]
            return { ...ship, ...defaultProps }
          });
        };
        return updatedShips;
      })
    }
  }, []);

  const editShipsButtonClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    setIsEditMode(true);
  }

  function updateShipById(id: number, data: UpdatedShip) {
    setShips((prevState) => {
      const updatedShips = { ...prevState };
      for (const key in updatedShips) {
        const shipType = key as keyof ShipsState;
        updatedShips[shipType] = updatedShips[shipType].map(ship =>
          ship.id == id ? { ...ship, ...data } : ship
        );
      }
      return updatedShips;
    });
  }

  return (
    <Container className='main-container'>
      <main>
        <div>
          <Ships isEditMode={isEditMode} allowedShips={ships} isGameStarted={isGameStarted} updateShip={updateShipById} />
          <GameBoard ref={gameBoardRef} isEnemyField />
          {isEditMode ?
            <ShipPlacements allowedShips={ships} updateShip={updateShipById} setEditMode={setIsEditMode} />
            :
            <Button onClick={editShipsButtonClickHandler} className='edit-ships-btn'>Edit ships placements</Button>
          }
        </div>
        <Menu user={{ email: "a", username: "a" }} />
      </main>
    </Container>
  )
}
