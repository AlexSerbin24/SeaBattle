import jsonwebtoken from "jsonwebtoken";
import UserData from "../types/userData";
import Token from "../models/token";

export default class TokenService{
    static  generateTokens(userData:Omit<UserData,"password">){
        const accessToken = jsonwebtoken.sign(userData, process.env.JWT_ACCESS_TOKEN_KEY as string);
        const refreshToken = jsonwebtoken.sign(userData, process.env.JWT_REFRESH_TOKEN_KEY as string);

        return {accessToken, refreshToken};
    }

    static async saveToken(userId:number, refreshToken:string){
        const tokenData = await Token.findOne({where:{userId}});
        if(tokenData){
            tokenData.refreshToken=refreshToken;
            await tokenData.save();
            return
        }
        return await Token.create({userId,refreshToken});
    }

    static async removeToken(refreshToken:string){
        const tokenData = await Token.destroy({where:{refreshToken}});
        return tokenData;
    }

    static async findToken(token:string){
        return await Token.findOne({where:{refreshToken:token}})
    }

    static validateAccessToken(accessToken:string){
        try {
            const tokenData = jsonwebtoken.verify(accessToken, process.env.JWT_ACCESS_TOKEN_KEY as string);
            return tokenData;
        } catch (error) {
            return null;
        }
    }

    static validateRefreshToken(refreshToken:string){
        try {
            const tokenData = jsonwebtoken.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_KEY as string);
            return tokenData;
        } catch (error) {
            return null;
        }
    }
}