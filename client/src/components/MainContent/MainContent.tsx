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
import LoginModal from './components/Modals/LoginModal'
import RegisterModal from './components/Modals/RegisterModal'
import User from '../../types/User'
import UserService from '../../services/UserService'
import { AxiosError } from 'axios'
import Game from '../../types/Game'
import useSocket from '../../hooks/useSocket'
import Loader from '../UI/Loader/Loader'


export default function MainContent() {
  const webSocket = useSocket();
  const gameBoardRef = useRef<HTMLTableElement>(null);
  const enemyGameBoardRef = useRef<HTMLTableElement>(null);
  const [loading, setLoading] = useState(false);
  const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false);
  const [user, setUser] = useState<User | null>(null)
  const [game, setGame] = useState<Game>({ isGameStated: false, gameOptions: null });
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
    UserService.refresh().then((data) => {
      const { accessToken, ...user } = data;
      localStorage.setItem("token", accessToken);
      setUser(user);
    }).catch((error: AxiosError) => console.log(error) /*TODO: handle expception*/);
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
      <Loader loading={loading}/>
      <main>
        <RegisterModal setLoading={setLoading} isRegisterModalVisible={isRegisterModalVisible} setUser={setUser} setIsRegisterModalVisible={setIsRegisterModalVisible} />
        <LoginModal setLoading={setLoading}  isLoginModalVisible={isLoginModalVisible} setUser={setUser} setIsLoginModalVisible={setIsLoginModalVisible} />
        <div>
          <Ships isEditMode={isEditMode} allowedShips={ships} isGameStarted={game.isGameStated} updateShip={updateShipById} />
          <GameBoard ref={gameBoardRef} isEnemyField={false} />
          {!game.isGameStated ? (
            isEditMode ?
              <ShipPlacements allowedShips={ships} updateShip={updateShipById} setEditMode={setIsEditMode} />
              :
              <Button onClick={editShipsButtonClickHandler} className='edit-ships-btn'>Edit ships placements</Button>
          )
            :
            <h3 style={{textAlign:"center"}}>{user?.username}</h3>
          }
        </div>

        {game.isGameStated ?
          <div>
            <GameBoard ref={enemyGameBoardRef} isEnemyField={true} />
            <h3 style={{textAlign:"center"}}>{game.gameOptions?.opponent}</h3>
          </div>
          :
          <Menu setLoading={setLoading}  user={user} setUser={setUser} setGame={setGame} setIsRegisterModalVisible={setIsRegisterModalVisible} setIsLoginModalVisible={setIsLoginModalVisible} />
        }
      </main>
    </Container>
  )
}
