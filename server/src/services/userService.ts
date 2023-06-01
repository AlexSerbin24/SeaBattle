import UserData from "../types/userData";
import User from "../models/user";
import bcrypt from "bcrypt";
import TokenService from "./tokenService";

export default class UserService {
    static async register(registerData: Omit<UserData, "trophies">) {

        const user = await User.findOne({where:{email:registerData.email}});
        if (user) {
            throw new Error("User is already existed");
        }

        const hashedPassword = await bcrypt.hash(registerData.password, 8);
        const newUser = await User.create({ email: registerData.email, password: hashedPassword, username:registerData.username});

        const userData = {email:newUser.email, username:newUser.username, trophies:newUser.trophies};
        const tokens =  TokenService.generateTokens(userData);
        await TokenService.saveToken(newUser.id,tokens.refreshToken);
        return {...tokens,...userData}

    }

    static async login(loginData: Omit<UserData, "trophies" | "username">) {
        const user = await User.findOne({where:{email:loginData.email}});
        if (!user) {
            throw new Error("User is not existed");
        }

        const isPasswordCorrect = await bcrypt.compare(loginData.password,user.password);
        if(!isPasswordCorrect){
            throw(new Error("Password is incorrect"));
        }

        const userData = {email:user.email, username:user.username, trophies:user.trophies};
        const tokens = TokenService.generateTokens(userData);
        await TokenService.saveToken(user.id,tokens.refreshToken);
        return {...tokens,...userData}
    }

    static async logout(refreshToken:string) {
        return await TokenService.removeToken(refreshToken)
    }

    static async refresh(refreshToken:string) {
        if(!refreshToken){
            throw new Error("Unauthorized");
        }

        const tokenData = TokenService.validateRefreshToken(refreshToken) as Omit<UserData, "password">;

        if(!tokenData){
            throw new Error("Unauthorized");
        }

        const user = await User.findOne({where:{email:tokenData.email}});

        if(!user){
            throw new Error("Something happened with user account...");
        }
        
        const userData = {email:user.email,username:user.username, trophies:user.trophies};
        
        const tokens =  TokenService.generateTokens(userData);
        await TokenService.saveToken(user.id,tokens.refreshToken);
        return {...tokens,...userData}
    }
}
