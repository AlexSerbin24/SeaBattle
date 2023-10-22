import UserData from "../types/userData";
import User from "../models/user";
import bcrypt from "bcrypt";
import TokenService from "./tokenService";
import { Op, Sequelize } from "sequelize";
import ApiError from "../types/errors/ApiError";

export default class UserService {
    static async register(registerData: Omit<UserData, "trophies">) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isEmailValid = emailRegex.test(registerData.email);
        if (!isEmailValid) {
            throw ApiError.BadRequest("Your email is not valid");
        }

        const isPasswordValid = registerData.password.length >= 4;

        if (!isPasswordValid) {
            throw ApiError.BadRequest("Your password is short. It should have at least 4 symbols.");
        }

        const user = await User.findOne({
            where: {
                [Op.or]:
                {
                    email: registerData.email, username: registerData.username
                }
            },

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

        if(user.blockSearch){
            throw ApiError.BadRequest("You can not login while you are playing now")
        }

        const isPasswordCorrect = await bcrypt.compare(loginData.password, user.password);
        if (!isPasswordCorrect) {
            throw ApiError.BadRequest("Password is incorrect");
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

        let user = await User.findOne({ where: { email: tokenData.email } });

        if (!user) {
            throw ApiError.BadRequest("Something happened with user account...");
        }

        if(user.blockSearch){
            let attempt = 1;

            while(true){
                await new Promise(resolve => setTimeout(resolve, 3000));
                user =  (await User.findOne({ where: { email: tokenData.email } })) as User;

                if(!user.blockSearch) break;

                if(attempt ==3) throw ApiError.BadRequest("Can not give actual user data");

                attempt ++;
                
            }
        }
        const userData = { email: user.email, username: user.username, trophies: user.trophies };

        const tokens = TokenService.generateTokens(userData);
        await TokenService.saveToken(user.id, tokens.refreshToken);
        return { ...tokens, ...userData }
    }

    static async updateUserTrophies(username: string, trophyCount: number) {
        return await User.update({ trophies: Sequelize.literal(`trophies + ${trophyCount}`) }, { where: { username } });
    }

    static async updateUserBlockSearchGame(username: string, blockSearchValue: boolean) {
        return await User.update({ blockSearch: blockSearchValue }, { where: { username } });
    }

    static async getUserBlockSearchStatus(username: string) {
        const user = await User.findOne({ where: { username } })

        if (!user)
            throw ApiError.BadRequest("Something happend with user account...");

        return user.blockSearch;
    }
}
