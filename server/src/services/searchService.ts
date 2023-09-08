import SearchUser from "../models/searchUser";
import { Op } from "sequelize";
import SearchUserData from "../types/searchUserData";

export default class SearchUserService {
    static async findSuitableOpponent(trophies: number): Promise<SearchUserData | null> {
        const opponent = await SearchUser.findOne({
            where: {
                trophies: {
                    [Op.between]: [trophies - 10, trophies + 10]
                }
            }
        })

        return opponent ? { socketId: opponent.socketId, username: opponent.username, trophies: opponent.trophies } : null;
    }

    static async addSearchUser(searchUser: SearchUserData) {

        return await SearchUser.create({ ...searchUser });
    }

    static async removeSearchUser(socketId: string) {
        return await SearchUser.destroy({
            where: {
                socketId
            }
        });
    }
}

