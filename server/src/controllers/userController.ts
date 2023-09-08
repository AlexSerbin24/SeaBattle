import { NextFunction, Request, Response } from "express";
import UserService from "../services/userService";
import UserData from "../types/userData";

export default class UserController {
    static async login(req: Request, res: Response, next:NextFunction) {
        try {
            const loginData = req.body as Omit<UserData, "username" | "trophies">
            const { refreshToken, ...result } = await UserService.login(loginData);
            res.cookie("refreshToken", refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
            res.send(result);
        } catch (error) {
            next(error);
        }

    }

    static async register(req: Request, res: Response, next:NextFunction) {
        try {
            console.log(req)
            const registerData = req.body as Omit<UserData, "trophies">
            const { refreshToken, ...result } = await UserService.register(registerData);
            res.cookie("refreshToken", refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
            res.send(result);
        } catch (error) {
            next(error);
        }
    }

    static async logout(req: Request, res: Response, next:NextFunction) {
        try {
            const {refreshToken} = req.cookies;
            await UserService.logout(refreshToken as string);
            res.clearCookie("refreshToken");
            res.send({message:"Logout was succeed"})
        } catch (error) {
            next(error);
        }
    }

    static async refresh(req: Request, res: Response, next:NextFunction) {
        try {
            const {refreshToken} = req.cookies;
            const {refreshToken:newRefreshToken, ...result} = await UserService.refresh(refreshToken as string);
            res.cookie("refreshToken", newRefreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
            res.send(result);

        } catch (error) {
            next(error);
        }
    }
}