import {sequelize} from "../config/db.js";
import { DataTypes, Model, CreationOptional } from "sequelize";

class SearchUser extends Model{
    declare id: CreationOptional<number>;
    declare socketId: string;
    declare username:string;
    declare trophies: number
}

SearchUser.init({
    id:{
        type:DataTypes.NUMBER,
        primaryKey:true,
        autoIncrement:true
    },
    socketId:{
        type:DataTypes.STRING,
        allowNull:false
    },
    username:{
        type:DataTypes.STRING,
        allowNull:true
    },
    trophies:{
        type:DataTypes.NUMBER,
        allowNull:false
    }
}, {sequelize});

export default SearchUser;