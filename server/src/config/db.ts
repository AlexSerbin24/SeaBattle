import { Sequelize } from "sequelize";


export const sequelize = new Sequelize({
    database:process.env.DB_DATABASE,
    host:process.env.DB_HOST,
    username:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    dialect:"mysql"
})

export default async function connectionToDb(){
    try {
        await sequelize.sync();
        console.log("Connection to db was succeed");
    } catch (error) {
        console.error((error as Error).message);
    }
}