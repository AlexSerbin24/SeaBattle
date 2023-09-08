import UserData from "../types/userData";
import User from "../models/user";
import bcrypt from "bcrypt";
import TokenService from "./tokenService";
import { Op, Sequelize } from "sequelize";
import ApiError from "../types/errors/ApiError";

export default class UserService {
    static async register(registerData: Omit<UserData, "trophies">) {

        const user = await User.findOne({
            where: {
                [Op.or]:
                {
                    email: registerData.email, username: registerData.username
                }
            }
        });
        if (user) {
            throw ApiError.BadRequest("User is already existed. Change email or user name");
        }


        const hashedPassword = await bcrypt.hash(registerData.password, 8);
        const newUser = await User.create({ email: registerData.email, password: hashedPassword, username: registerData.username });

        const userData = { email: newUser.email, username: newUser.username, trophies: newUser.trophies };
        const tokens = TokenService.generateTokens(userData);
        await TokenService.saveToken(newUser.id, tokens.refreshToken);
        return { ...tokens, ...userData }

    }

    static async login(loginData: Omit<UserData, "trophies" | "username">) {
        const user = await User.findOne({ where: { email: loginData.email } });
        if (!user) {
            throw ApiError.BadRequest("User is not existed");
        }

        const isPasswordCorrect = await bcrypt.compare(loginData.password, user.password);
        if (!isPasswordCorrect) {
            throw  ApiError.BadRequest("Password is incorrect");
        }

        const userData = { email: user.email, username: user.username, trophies: user.trophies };
        const tokens = TokenService.generateTokens(userData);
        await TokenService.saveToken(user.id, tokens.refreshToken);
        return { ...tokens, ...userData }
    }

    static async logout(refreshToken: string) {
        return await TokenService.removeToken(refreshToken)
    }

    static async refresh(refreshToken: string) {
        if (!refreshToken) {
            throw ApiError.Unauthorized();
        }

        const tokenData = TokenService.validateRefreshToken(refreshToken) as Omit<UserData, "password">;

        if (!tokenData) {
            throw ApiError.Unauthorized();
        }

        const user = await User.findOne({ where: { email: tokenData.email } });

        if (!user) {
            throw ApiError.BadRequest("Something happened with user account...");
        }

        const userData = { email: user.email, username: user.username, trophies: user.trophies };

        const tokens = TokenService.generateTokens(userData);
        console.log(tokens)
        await TokenService.saveToken(user.id, tokens.refreshToken);
        return { ...tokens, ...userData }
    }

    static async updateUserTrophies(username: string, trophyCount: number) {
        return await User.update({ trophies: Sequelize.literal(`trophies + ${trophyCount}`) }, { where: { username } });
    }
}
