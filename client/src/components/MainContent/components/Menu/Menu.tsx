import React, { useState, useEffect } from 'react'
import Button from '../../../UI/Button/Button'
import UserService from '../../../../services/UserService';
import useSocket from '../../../../hooks/useSocket';
import GameOptions from '../../../../types/GameOptions';
import { useUserContext } from '../../../../contexts/userContext';
import { AxiosError } from 'axios';
import ErrorModal from '../Modals/ErrorModal';

type Props = {
    isEditMode: boolean,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    startGame: (gameOptions?: GameOptions) => void,
    setIsLoginModalVisible: React.Dispatch<React.SetStateAction<boolean>>,
    setIsRegisterModalVisible: React.Dispatch<React.SetStateAction<boolean>>
};

export default function Menu({ isEditMode, setLoading, startGame, setIsLoginModalVisible, setIsRegisterModalVisible }: Props) {
    const { user, setUser } = useUserContext();
    const webSocket = useSocket();
    const [errorModal, setErrorModal] = useState(false);
    const [errorText, setErrorText] = useState("")

    const singleplayerButtonClickHandler = (event: React.MouseEvent) => {
        startGame();
    }

    const loginButtonClickHandler = (event: React.MouseEvent) => {
        setIsLoginModalVisible(true)
    }

    const registerButtonClickHandler = (event: React.MouseEvent) => {
        setIsRegisterModalVisible(true)
    }


    useEffect(() => {

        function opponentFound(gameOptions: GameOptions) {
            startGame(gameOptions);
            setLoading(false);
        }

        async function invalidToken() {
            try {
                const { accessToken } = await UserService.refresh();
                localStorage.setItem("token", accessToken);
                webSocket.sendMessage("search opponent:searching", { username: user?.username, trophies: user?.trophies });
            } catch (error) {
                setUser(null);
                setLoading(false);

                const axiosError = error as AxiosError<{ message: string }>;
                const message = axiosError.response?.data.message as string;

                setErrorText(message)
                setErrorModal(true);
            }
        }

        async function blockSearchError() {
            setUser(null);
            setLoading(false);
            setErrorText("You can not search another game while you are playing")
            setErrorModal(true);
        }

        webSocket.onMessage("search opponent:opponent found(client)", opponentFound);
        webSocket.onMessage("search opponent:invalid token(client)", invalidToken);
        webSocket.onMessage("search opponent:searching is blocked(client)", blockSearchError);

        return () => {
            webSocket.offMessage("search opponent:opponent found(client)", opponentFound);
            webSocket.offMessage("search opponent:invalid token(client)", invalidToken);
            webSocket.offMessage("search opponent:searching is blocked(client)", blockSearchError);
        }
    }, [webSocket])


    const toBattleButtonClickHandler = (event: React.MouseEvent) => {
        setLoading(true);
        webSocket.sendMessage("search opponent:searching", { username: user?.username, trophies: user?.trophies });
    }

    const logoutButtonClickHandler = async (event: React.MouseEvent) => {
        setLoading(true);
        await UserService.logout();
        localStorage.removeItem("token");
        setUser(null);
        setLoading(false);
    }

    return (
        <div className='menu'>
            <ErrorModal isErrorModalVisible={errorModal} setIsErrorModalVisible={setErrorModal} errorMessage={errorText} />

            <Button onClick={singleplayerButtonClickHandler} disabled={isEditMode} className='singleplayer-btn'>Play with bot</Button>
            {
                user
                    ?
                    <>
                        <Button disabled={isEditMode} onClick={toBattleButtonClickHandler} className='multiplayer-btn'>To battle</Button>
                        <Button onClick={logoutButtonClickHandler} className='logout-btn'>Logout</Button>
                    </>
                    :
                    <>
                        <Button onClick={loginButtonClickHandler} className='login-btn'>Login</Button>
                        <Button onClick={registerButtonClickHandler} className='register-btn'>Register</Button>
                    </>

            }
        </div>
    )
}
