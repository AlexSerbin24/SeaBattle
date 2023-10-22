import React, { useState, useEffect } from 'react';
import Container from '../UI/Container/Container';
import Menu from './components/Menu/Menu';
import LoginModal from './components/Modals/LoginModal';
import RegisterModal from './components/Modals/RegisterModal';
import User from '../../types/User';
import UserService from '../../services/UserService';
import Game from '../../types/Game';
import Loader from '../UI/Loader/Loader';
import OpponentBoard from './components/GameBoard/components/OpponentBoard/OpponentBoard';
import PlayerBoard from './components/GameBoard/components/PlayerBoard/PlayerBoard';
import GameOptions from '../../types/GameOptions';
import PlayerStatus from './components/PlayerStatus/PlayerStatus';
import WaitingOpponentMove from './components/WaitingOpponentMove/WaitingOpponentMove';
import { useUserContext } from '../../contexts/userContext';
import Modal from '../UI/Modal/Modal';
import { AxiosError } from 'axios';
import ErrorModal from './components/Modals/ErrorModal';

export default function MainContent() {
  const [loading, setLoading] = useState(false);
  const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const { user, setUser } = useUserContext()

  const defaultGameOptions: GameOptions = {
    room: "",
    currentPlayer: user?.username ?? "Player",
    opponent: "Bot",
    opponentTrophies: 0,
    type: "singleplayer",
    winner: "",
  }

  const [game, setGame] = useState<Game>({ isGameStarted: false, isGameFinished: false, gameOptions: defaultGameOptions });
  const [errorModal, setErrorModal] = useState(false);
  const [errorText, setErrorText] = useState("")

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
      })
      .catch((error) => {
        const axiosError = error as AxiosError<{ message: string }>;
        console.log(axiosError)
        if(axiosError.code=="ERR_NETWORK"){
          setErrorText("There are some problems here. Check your network connection or wait for a while");
          setErrorModal(true);
        }
        else if (axiosError.response?.status as number != 401) {
          const message = axiosError.response?.data.message as string;
          setErrorText(message);
          setErrorModal(true);
        }
      })
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

      <ErrorModal isErrorModalVisible={errorModal} setIsErrorModalVisible={setErrorModal} errorMessage={errorText}/>
      
      <Modal title='Error' isVisible={errorModal} setModal={setErrorModal}>
        <h3 style={{ textAlign: "center" }}>{errorText}</h3>
      </Modal>

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
          setIsRegisterModalVisible={setIsRegisterModalVisible}
        />
        <LoginModal
          setLoading={setLoading}
          isLoginModalVisible={isLoginModalVisible}
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
