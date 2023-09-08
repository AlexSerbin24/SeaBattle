import {sequelize} from "../config/db";
import { DataTypes, Model, CreationOptional } from "sequelize";

class SearchUser extends Model{
    declare id: CreationOptional<number>;
    declare socketId: string;
    declare username:string;
    declare trophies: number
}

SearchUser.init({
    id:{
        type:DataTypes.INTEGER,
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
        type:DataTypes.INTEGER,
        allowNull:false
    }
}, {sequelize});

export default SearchUser;