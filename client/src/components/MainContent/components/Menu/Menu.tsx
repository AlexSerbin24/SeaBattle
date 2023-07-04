import React, { useState, useEffect } from 'react'
import Button from '../../../UI/Button/Button'
import User from '../../../../types/User'
import UserService from '../../../../services/UserService';
import useSocket from '../../../../hooks/useSocket';
import GameOptions from '../../../../types/GameOptions';
import Game from '../../../../types/Game';

type Props = {
    isEditMode:boolean,
    user: User | null,
    setLoading:React.Dispatch<React.SetStateAction<boolean>>,
    setUser: React.Dispatch<React.SetStateAction<User | null>>,
    setGame:React.Dispatch<React.SetStateAction<Game>>,
    setIsLoginModalVisible: React.Dispatch<React.SetStateAction<boolean>>,
    setIsRegisterModalVisible: React.Dispatch<React.SetStateAction<boolean>>
};

export default function Menu({ user, isEditMode, setUser, setLoading, setGame, setIsLoginModalVisible, setIsRegisterModalVisible }: Props) {
    const webSocket = useSocket();
    const [currentUserOnlineCount, setCurrentUserOnlineCount] = useState(0);

    const loginButtonClickHandler = (event: React.MouseEvent) => {
        setIsLoginModalVisible(true)
    }

    const registerButtonClickHandler = (event: React.MouseEvent) => {
        setIsRegisterModalVisible(true)
    }

    useEffect(() => {
        function giveUserOnlineCount(userOnlineCount:number){
            setCurrentUserOnlineCount(userOnlineCount);
        }
        function opponentFound(gameOptions:GameOptions){
            console.log(gameOptions)
            setGame({gameOptions,isGameStarted:true, isGameFinished:false});
            setLoading(false);
        }
        webSocket.onMessage("user online:give user online count", giveUserOnlineCount);
        webSocket.onMessage("search opponent:opponent found", opponentFound);

        webSocket.sendMessage("user online:give user online count");

        return ()=>{
            webSocket.offMessage("user online:give user online count", giveUserOnlineCount);
            webSocket.offMessage("search opponent:opponent found", opponentFound);
        }
    }, [])


    const toBattleButtonClickHandler = (event: React.MouseEvent) => {
        setLoading(true);
        webSocket.sendMessage("search opponent:searching", { username: user?.username, trophies: user?.trophies });
    }

    const logoutButtonClickHandler = async (event: React.MouseEvent) => {
        setLoading(true);
        try {
            await UserService.logout();
            localStorage.removeItem("token");
            setUser(null);
        } catch (error) {
            console.log(error) //TODO: handle exception in logout
        }
        finally{
            setLoading(false);
        }
    }

    return (
        <div className='menu'>
            <Button disabled={isEditMode} className='singleplayer-btn'>Play with bot</Button>
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
