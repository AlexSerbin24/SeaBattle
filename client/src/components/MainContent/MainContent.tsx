import React, { useState, useEffect } from 'react';
import Container from '../UI/Container/Container';
import Menu from './components/Menu/Menu';
import LoginModal from './components/Modals/LoginModal';
import RegisterModal from './components/Modals/RegisterModal';
import User from '../../types/User';
import UserService from '../../services/UserService';
import { AxiosError } from 'axios';
import Game from '../../types/Game';
import useSocket from '../../hooks/useSocket';
import Loader from '../UI/Loader/Loader';
import OpponentBoard from './components/GameBoard/components/OpponentBoard';
import PlayerBoard from './components/GameBoard/components/PlayerBoard';
import GameOptions from '../../types/GameOptions';
import WaitingOpponentMove from './components/WaitingOpponentMove/WaitingOpponentMove';

export default function MainContent() {
  const socket = useSocket();
  const [loading, setLoading] = useState(false);
  const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [game, setGame] = useState<Game>({
    isGameStarted: false,
    isGameFinished: false,
    gameOptions: null
  });

  useEffect(() => {
    // Refresh user token and store access token in local storage
    UserService.refresh()
      .then((data) => {
        const { accessToken, ...user } = data;
        localStorage.setItem("token", accessToken);
        setUser(user);
      })
      .catch((error: AxiosError) =>
        console.log(error) /*TODO: handle exception*/
      );
  }, []);

  useEffect(() => {
    if (game.isGameStarted) {
      // Update current player when receiving a message
      const changeCurrentPlayer = (nextMovePlayer: string) => {
        const gameOptions = { ...game.gameOptions, currentPlayer: nextMovePlayer } as GameOptions;
        setGame(prevState => ({ ...prevState, gameOptions }));
      };

      // Handle game over event
      const gameOver = (winnerTrophies: number, loserTrophies: number) => {
        // Update user trophies based on the game result
        const [userTrophies, opponentTrophies] =
          user?.username === game.gameOptions?.currentPlayer
            ? [winnerTrophies, loserTrophies]
            : [loserTrophies, winnerTrophies];

        setUser(prevState => {
          const userState = { ...prevState as User };
          return { ...userState, trophies: userTrophies };
        });

        // Update game state to mark it as finished and update opponent trophies
        setGame(prevState => {
          const gameOptions = { ...prevState.gameOptions } as GameOptions;
          gameOptions.opponentTrophies = opponentTrophies;
          return { ...prevState, isGameFinished: true, gameOptions };
        });
      };

      // Subscribe to socket messages for game events
      socket.onMessage("game:change current player", changeCurrentPlayer);
      socket.onMessage("game:game over", gameOver);

      // Clean up subscriptions on component unmount
      return () => {
        socket.offMessage("game:change current player", changeCurrentPlayer);
        socket.offMessage("game:game over", gameOver);
      };
    }
  }, [game.isGameStarted]);

  useEffect(() => {
    if (game.isGameFinished) {
      // Return to menu after 10 seconds when the game is finished
      const timeoutId = setTimeout(() => {
        setGame({ isGameStarted: false, gameOptions: null, isGameFinished: false });
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

      {/* Show WaitingOpponentMove component if the game is in progress and opponent is making his move */}
      {user && game.gameOptions && (
        <WaitingOpponentMove
          isWaiting={user.username !== game.gameOptions.currentPlayer && !game.isGameFinished}
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

        <div>
          {/* Player's game board */}
          <PlayerBoard
            game={game}
            username={user?.username}
            trophies={user?.trophies}
            isEditMode={isEditMode}
            setIsEditMode={setIsEditMode}
            editShipsButtonClickHandler={editShipsButtonClickHandler}
          />
        </div>

        {/* Show current player or winner */}
        {game.isGameStarted && (
          <h3 style={{ textAlign: "center" }}>
            {!game.isGameFinished
              ? `Now it's player turn: ${game.gameOptions?.currentPlayer}`
              : `Winner is ${game.gameOptions?.currentPlayer}`}
          </h3>
        )}

        {/* Show opponent's game board or menu */}
        {game.isGameStarted ? (
          <OpponentBoard game={game} />
        ) : (
          <Menu
            setLoading={setLoading}
            user={user}
            setUser={setUser}
            setGame={setGame}
            setIsRegisterModalVisible={setIsRegisterModalVisible}
            setIsLoginModalVisible={setIsLoginModalVisible}
          />
        )}
      </main>
    </Container>
  );
}
