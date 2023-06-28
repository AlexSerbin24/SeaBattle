import axiosInstance from "../axios/axiosInstance";
import { RegisterData, LoginData, UserData } from "../types/UserData";

export default class UserService {
    static async login(loginData: LoginData) {
        const response = await axiosInstance.post<UserData>("user/login", loginData);
        return response.data;
    }

    static async register(regiserData: RegisterData) {
        const response = await axiosInstance.post<UserData>("user/registration", regiserData);
        return response.data;

    }

    static async logout() {
        await axiosInstance.post<{ message: string }>("user/logout");

    }

    static async refresh() {
        const response = await axiosInstance.post<UserData>("user/refresh");
        return response.data;

    }
}