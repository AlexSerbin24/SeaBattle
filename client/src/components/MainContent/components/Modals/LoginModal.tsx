import React, { useState } from 'react';
import Modal from '../../../UI/Modal/Modal';
import Input from '../../../UI/Input/Input';
import { LoginData } from '../../../../types/UserData';
import Button from '../../../UI/Button/Button';
import { LoginFormErrors } from '../../../../types/UserFormsErrors';
import UserService from '../../../../services/UserService';
import User from '../../../../types/User';
import { AxiosError } from 'axios';

type Props = {
    isLoginModalVisible: boolean,
    setUser: React.Dispatch<React.SetStateAction<User | null>>,
    setIsLoginModalVisible: React.Dispatch<React.SetStateAction<boolean>>
}
export default function LoginModal({ isLoginModalVisible, setUser, setIsLoginModalVisible }: Props) {
    const [loginData, setLoginData] = useState<LoginData>({ email: "", password: "" })
    const [errors, setErrors] = useState<LoginFormErrors>({ email: "", password: "", server: "" })

    const submitLoginForm = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrors({ email: "", password: "", server: "" });

        const formErrors = { email: "", password: "", server: "" };
        if (!loginData.email) formErrors.email = "Email is empty";

        if (!loginData.password) formErrors.password = "Password is empty";

        if (Object.values(formErrors).some(error => error != "")) {
            setErrors(prevErrors => ({ ...prevErrors, ...formErrors }));
            return;
        }
        try {
            const response = await UserService.login(loginData);
            const {accessToken, ...user} = response;
            localStorage.setItem("token", accessToken);
            setUser(user);
            setIsLoginModalVisible(false);
        } catch (error) {
            const axiosError = error as AxiosError;
            const message = axiosError.response?.data as string;
            setErrors(prevErrors => ({ ...prevErrors, server:message }));
        }
    }
    return (
        <Modal title='Login' isVisible={isLoginModalVisible} setModal={setIsLoginModalVisible}>
            <form onSubmit={submitLoginForm} className='user-form'>
                <div style={{marginBottom:15}}><span className='error'>{errors.server}</span></div>
                <label>
                    <span>Email:</span>
                    <Input value={loginData.email} onChange={(event) => setLoginData({ ...loginData, email: event.target.value })} type='text' />
                    <span className='error'>{errors.email}</span>
                </label>
                <label>
                    <span>Password:</span>
                    <Input value={loginData.password} onChange={(event) => setLoginData({ ...loginData, password: event.target.value })} type='password' />
                    <span className='error'>{errors.password}</span>
                </label>
                <Button>Login</Button>
            </form>
        </Modal>
    )
}
