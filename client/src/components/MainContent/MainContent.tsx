import React, { useState, useEffect } from 'react';
import Container from '../UI/Container/Container';
import Menu from './components/Menu/Menu';
import LoginModal from './components/Modals/LoginModal';
import RegisterModal from './components/Modals/RegisterModal';
import User from '../../types/User';
import UserService from '../../services/UserService';
import { AxiosError } from 'axios';
import Game from '../../types/Game';
import Loader from '../UI/Loader/Loader';
import OpponentBoard from './components/GameBoard/components/OpponentBoard/OpponentBoard';
import PlayerBoard from './components/GameBoard/components/PlayerBoard/PlayerBoard';
import GameOptions from '../../types/GameOptions';
import PlayerStatus from './components/PlayerStatus/PlayerStatus';
import WaitingOpponentMove from './components/WaitingOpponentMove/WaitingOpponentMove';
import { useUserContext } from '../../contexts/userContext';

export default function MainContent() {
  const [loading, setLoading] = useState(false);
  const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const {user, setUser }= useUserContext()

  const defaultGameOptions: GameOptions = {
    room: "",
    currentPlayer: user?.username ?? "Player",
    opponent: "Bot",
    opponentTrophies: 0,
    type: "singleplayer",
    winner: "",
  }

  const [game, setGame] = useState<Game>({ isGameStarted: false, isGameFinished: false, gameOptions: defaultGameOptions });

  /**
   * Start game. According to game type change game options.
   * @param gameOptions Game options. By default it is for singleplayer
   */
  const startGame = (gameOptions: GameOptions = defaultGameOptions) => {
    setGame({ gameOptions, isGameStarted: true, isGameFinished: false })
  }

  /**
   * Change current player
   * @param nextMovePlayer Player that will make move
   */
  const changeCurrentPlayer = (nextMovePlayer: string) => {
    const gameOptions = { ...game.gameOptions, currentPlayer: nextMovePlayer } as GameOptions;
    setGame(prevState => ({ ...prevState, gameOptions })); //change currentPlayer
  }

  /**
   * Finish game. Shows the winner and changes trophies
   * @param userTrophies New user trophies value. For unauthorized user is 0
   * @param opponentTrophies New opponent trophies value. Default opponent is bot so default trophies value is 0
   */
  const finishGame = (winner: string, userTrophies: number = user?.trophies ?? 0, opponentTrophies: number = 0) => {
    if (game.gameOptions.type == "multiplayer") {
      setUser(prevState => {
        const userState = { ...prevState as User };
        return { ...userState, trophies: userTrophies };
      })

    }
    // Update game state to mark it as finished and update opponent trophies
    setGame(prevState => {
      const gameOptions = { ...prevState.gameOptions } as GameOptions;
      gameOptions.opponentTrophies = opponentTrophies;
      gameOptions.winner = winner;
      return { ...prevState, isGameFinished: true, gameOptions };
    }); //finish game

  }

  /**
   * Close game function. It returns player to main menu
   */
  const closeGame = () => {
    setGame({ isGameStarted: false, gameOptions: defaultGameOptions, isGameFinished: false });
  }

  useEffect(() => {
    // Refresh user token and store access token in local storage
    UserService.refresh()
      .then((data) => {
        const { accessToken, ...user } = data;
        localStorage.setItem("token", accessToken);
        setUser(user);
      });
  }, []);

  //Game finish useEffect
  useEffect(() => {
    if (game.isGameFinished) {
      // Return to menu after 10 seconds when the game is finished
      const timeoutId = setTimeout(() => {
        closeGame();
      }, 10000);

      // Clean up timeout on component unmount or when the game is reset
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [game.isGameFinished]);

  const editShipsButtonClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    setIsEditMode(true);
  };

  return (
    <Container className='main-container'>
      <Loader loading={loading} />

      {/* Show WaitingOpponentMove component if the game is in progress and opponent is making his move or game is finished */}
      {game.isGameStarted && (
        <WaitingOpponentMove
          isWaiting={(user && user.username !== game.gameOptions.currentPlayer) || (game.gameOptions.currentPlayer == defaultGameOptions.opponent) || game.isGameFinished}
        />
      )}

      <main>
        {/* Modals for login and registration */}
        <RegisterModal
          setLoading={setLoading}
          isRegisterModalVisible={isRegisterModalVisible}
          setUser={setUser}
          setIsRegisterModalVisible={setIsRegisterModalVisible}
        />
        <LoginModal
          setLoading={setLoading}
          isLoginModalVisible={isLoginModalVisible}
          setUser={setUser}
          setIsLoginModalVisible={setIsLoginModalVisible}
        />

        {/* Show current player or winner */}
        {game.isGameStarted ?

          <PlayerStatus
            isGameFinished={game.isGameFinished}
            currentPlayer={game.gameOptions?.currentPlayer as string}
            winner={game.gameOptions?.winner as string} />
          :
          <h3 style={{ textAlign: "center" }}>Place your ships</h3>
        }

        <div className='main-content'>
          {/* Player's game board */}
          <PlayerBoard
            game={game}
            changeCurrentPlayer={changeCurrentPlayer}
            finishGame={finishGame}
            username={user?.username ?? "Player"}
            trophies={user?.trophies ?? 0}
            isEditMode={isEditMode}
            setIsEditMode={setIsEditMode}
            editShipsButtonClickHandler={editShipsButtonClickHandler}
          />

          {/* Show opponent's game board or menu */}
          {game.isGameStarted ?
            <OpponentBoard game={game} username={user?.username ?? "Player"} changeCurrentPlayer={changeCurrentPlayer} finishGame={finishGame} />
            :
            <Menu
              isEditMode={isEditMode}
              setLoading={setLoading}
              user={user}
              setUser={setUser}
              startGame={startGame}
              setIsRegisterModalVisible={setIsRegisterModalVisible}
              setIsLoginModalVisible={setIsLoginModalVisible}
            />
          }

        </div>
      </main>
    </Container>
  );
}
