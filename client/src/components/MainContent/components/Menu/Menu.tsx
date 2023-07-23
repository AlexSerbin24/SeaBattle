import React, { useState, useEffect } from 'react'
import Button from '../../../UI/Button/Button'
import User from '../../../../types/User'
import UserService from '../../../../services/UserService';
import useSocket from '../../../../hooks/useSocket';
import GameOptions from '../../../../types/GameOptions';
import Modal from '../../../UI/Modal/Modal';
import { useUserContext } from '../../../../contexts/userContext';

type Props = {
    isEditMode: boolean,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    startGame: (gameOptions?: GameOptions) => void,
    setIsLoginModalVisible: React.Dispatch<React.SetStateAction<boolean>>,
    setIsRegisterModalVisible: React.Dispatch<React.SetStateAction<boolean>>
};

export default function Menu({isEditMode, setLoading, startGame, setIsLoginModalVisible, setIsRegisterModalVisible }: Props) {
    const{user,setUser} = useUserContext();
    const webSocket = useSocket();
    const [currentUserOnlineCount, setCurrentUserOnlineCount] = useState(0);
    const [errorModal, setErrorModal] = useState(false);

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
        function giveUserOnlineCount(userOnlineCount: number) {
            setCurrentUserOnlineCount(userOnlineCount);
        }
        function opponentFound(gameOptions: GameOptions) {
            startGame(gameOptions);
            setLoading(false);
        }
        async function invalidToken() {
            try {
                const { accessToken } =  await UserService.refresh();
                localStorage.setItem("token", accessToken);
                webSocket.sendMessage("search opponent:searching", { username: user?.username, trophies: user?.trophies });
            } catch (error) {
                setUser(null);
                setLoading(false);
                setErrorModal(true);
            }
        }
        webSocket.onMessage("user online:give user online count", giveUserOnlineCount);
        webSocket.onMessage("search opponent:opponent found", opponentFound);
        webSocket.onMessage("search opponent:invalid token", invalidToken);

        webSocket.sendMessage("user online:give user online count");

        return () => {
            webSocket.offMessage("user online:give user online count", giveUserOnlineCount);
            webSocket.offMessage("search opponent:opponent found", opponentFound);
            webSocket.offMessage("search opponent:invalid token", invalidToken);
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
            <Modal title='Error' isVisible={errorModal} setModal={setErrorModal}>
                <h3 style={{ textAlign: "center"}}>You are not authrorized or internet connection is lost.</h3>
            </Modal>

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

            <h3>Players online: {currentUserOnlineCount}</h3>
        </div>
    )
}
