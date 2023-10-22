import React, { useState } from 'react';
import Modal from '../../../UI/Modal/Modal';
import Input from '../../../UI/Input/Input';
import { RegisterData } from '../../../../types/UserData';
import Button from '../../../UI/Button/Button';
import { RegisterFormErrors } from '../../../../types/UserFormsErrors';
import UserService from '../../../../services/UserService';
import { AxiosError } from 'axios';
import { useUserContext } from '../../../../contexts/userContext';

type Props = {
    isRegisterModalVisible: boolean,
    setLoading:React.Dispatch<React.SetStateAction<boolean>>,
    setIsRegisterModalVisible: React.Dispatch<React.SetStateAction<boolean>>
}
export default function RegisterModal({ isRegisterModalVisible, setLoading, setIsRegisterModalVisible }: Props) {
    const {setUser} = useUserContext();
    const [registerData, setRegisterData] = useState<RegisterData>({ email: "", password: "", username: "" });
    const [errors, setErrors] = useState<RegisterFormErrors>({ email: "", password: "", username: "", server: "" });

    const submitRegisterForm = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setErrors({ email: "", password: "", username:"", server: "" });

        const formErrors = { email: "", password: "", username:"", server: "" };
        if (!registerData.email) formErrors.email = "Email is empty";

        if (!registerData.password) formErrors.password = "Password is empty";

        if (!registerData.username) formErrors.username = "Username is empty";

        if (Object.values(formErrors).some(error => error != "")) {
            setErrors(prevErrors => ({ ...prevErrors, ...formErrors }));
            setLoading(false);
            return;
        }
        
        try {
            const response = await UserService.register(registerData);
            const {accessToken, ...user} = response;
            localStorage.setItem("token", accessToken);
            setUser(user);
            setIsRegisterModalVisible(false);
        } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            const message = axiosError.code == "ERR_NETWORK"
                ?
                "There are some problems here. Check your network connection or wait for a while"
                :
                axiosError.response?.data.message as string;
                
            setErrors(prevErrors => ({ ...prevErrors, server: message }));
        }
        finally{
            setLoading(false);
        }

    }

    return (
        <Modal title='Register' isVisible={isRegisterModalVisible} setModal={setIsRegisterModalVisible}>
            <form onSubmit={submitRegisterForm} className='user-form'>
                <div style={{marginBottom:15, textAlign:"center"}}><span className='error'>{errors.server}</span></div>
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
