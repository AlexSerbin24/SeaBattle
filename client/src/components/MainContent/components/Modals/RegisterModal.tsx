import React, { useState } from 'react';
import Modal from '../../../UI/Modal/Modal';
import Input from '../../../UI/Input/Input';
import { RegisterData } from '../../../../types/UserData';
import Button from '../../../UI/Button/Button';
import { RegisterFormErrors } from '../../../../types/UserFormsErrors';
import User from '../../../../types/User';
import UserService from '../../../../services/UserService';
import { AxiosError } from 'axios';

type Props = {
    isRegisterModalVisible: boolean,
    setUser: React.Dispatch<React.SetStateAction<User | null>>,
    setIsRegisterModalVisible: React.Dispatch<React.SetStateAction<boolean>>
}
export default function RegisterModal({ isRegisterModalVisible, setUser, setIsRegisterModalVisible }: Props) {
    const [registerData, setRegisterData] = useState<RegisterData>({ email: "", password: "", username: "" });
    const [errors, setErrors] = useState<RegisterFormErrors>({ email: "", password: "", username: "", server: "" });

    const submitRegisterForm = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrors({ email: "", password: "", username:"", server: "" });

        const formErrors = { email: "", password: "", username:"", server: "" };
        if (!registerData.email) formErrors.email = "Email is empty";

        if (!registerData.password) formErrors.password = "Password is empty";

        if (!registerData.username) formErrors.username = "Username is empty";

        if (Object.values(formErrors).some(error => error != "")) {
            setErrors(prevErrors => ({ ...prevErrors, ...formErrors }));
            return;
        }
        
        try {
            const response = await UserService.register(registerData);
            const {accessToken, ...user} = response;
            localStorage.setItem("token", accessToken);
            setUser(user);
            setIsRegisterModalVisible(false);
        } catch (error) {
            const axiosError = error as AxiosError;
            const message = axiosError.response?.data as string;
            setErrors(prevErrors => ({ ...prevErrors, server:message }));
        }
    }

    return (
        <Modal title='Register' isVisible={isRegisterModalVisible} setModal={setIsRegisterModalVisible}>
            <form onSubmit={submitRegisterForm} className='user-form'>
                <div style={{ marginBottom: 15 }}><span className='error'>{errors.server}</span></div>
                <label>
                    <span>Email:</span>
                    <Input value={registerData.email} onChange={(event) => setRegisterData({ ...registerData, email: event.target.value })} type='text' />
                    <span className='error'>{errors.email}</span>
                </label>
                <label>
                    <span>Username:</span>
                    <Input value={registerData.username} onChange={(event) => setRegisterData({ ...registerData, username: event.target.value })} type='text' />
                    <span className='error'>{errors.username}</span>
                </label>
                <label>
                    <span>Password:</span>
                    <Input value={registerData.password} onChange={(event) => setRegisterData({ ...registerData, password: event.target.value })} type='password' />
                    <span className='error'>{errors.password}</span>
                </label>
                <Button>Register</Button>
            </form>
        </Modal>
    )
}
