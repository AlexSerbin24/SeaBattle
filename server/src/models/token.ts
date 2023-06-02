import { sequelize } from "../config/db.js";
import { DataTypes, Model, CreationOptional, ForeignKey} from "sequelize";
import User from "./user.js";


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

Token.belongsTo(User,{
    foreignKey:"userId"
})

export default Token;