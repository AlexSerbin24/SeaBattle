import { sequelize } from "../config/db";
import { DataTypes, Model, CreationOptional, ForeignKey} from "sequelize";
import User from "./user";


class Token extends Model{
    declare id:CreationOptional<number>;
    declare refreshToken:string;
    declare userId:ForeignKey<User["id"]>
}
Token.init( {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    refreshToken: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {sequelize});

Token.hasOne(User,{
    foreignKey:"userId"
})

export default Token;