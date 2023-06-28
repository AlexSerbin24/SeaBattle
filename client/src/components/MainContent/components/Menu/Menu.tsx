import React, { Children } from 'react'
import Button from '../../../UI/Button/Button'
import User from '../../../../types/User'
import UserService from '../../../../services/UserService';

type Props = {
    user: User | null,
    setUser:React.Dispatch<React.SetStateAction<User | null>>,
    setIsLoginModalVisible:React.Dispatch<React.SetStateAction<boolean>>,
    setIsRegisterModalVisible:React.Dispatch<React.SetStateAction<boolean>>
};

export default function Menu({ user, setUser, setIsLoginModalVisible,setIsRegisterModalVisible }: Props) {

    const loginButtonClickHandler = (event:React.MouseEvent)=>{
        setIsLoginModalVisible(true)
    }

    const registerButtonClickHandler = (event:React.MouseEvent)=>{
        setIsRegisterModalVisible(true)
    }

    const logoutButtonClickHandler = async (event:React.MouseEvent)=>{
        try {
            await UserService.logout();
            localStorage.removeItem("token");
            setUser(null);
        } catch (error) {
            console.log(error) //TODO: handle exception in logout
        }
    }

    return (
        <div className='menu'>
            <Button className='singleplayer-btn'>Play with bot</Button>
            {
                user
                    ?
                    <>
                        <Button className='multiplayer-btn'>To battle</Button>
                        <Button onClick={logoutButtonClickHandler} className='logout-btn'>Logout</Button>
                    </>
                    :
                    <>
                        <Button onClick={loginButtonClickHandler} className='login-btn'>Login</Button>
                        <Button onClick={registerButtonClickHandler} className='register-btn'>Register</Button>
                    </>

            }

            <h3>Players online: 1488</h3>
        </div>
    )
}
