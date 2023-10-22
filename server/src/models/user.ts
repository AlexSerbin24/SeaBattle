import { sequelize } from "../config/db";
import {DataTypes, Model,CreationOptional} from "sequelize"


class User extends Model{
    declare id: CreationOptional<number>;
    declare email:string;
    declare username:string;
    declare password :string;
    declare trophies:number;
    declare blockSearch:boolean
};

User.init({
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    email:{
        type:DataTypes.STRING,
        validate:{
            isEmail:true
        },
        allowNull:false
    },
    username:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    password:{
        type:DataTypes.STRING,
        validate:{
            min:4,
        },
        allowNull:false
    },
    trophies:{
        type:DataTypes.INTEGER,
        defaultValue:0,
        allowNull:false
    },
    blockSearch:{
        type:DataTypes.BOOLEAN,
        defaultValue:false,
        allowNull:false
    }
}, {sequelize});

export default User;
