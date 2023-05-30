import mysql from "mysql2";

export default function connectToDb(){
    const connection = mysql.createConnection({
        host:process.env.DB_HOST,
        user: process.env.DB_USER,
        password:process.env.DB_PASSWORD,
        database:process.env.DB_DATABASE
    })

    connection.connect((err)=>{
        if(err){
            console.error(err.message);
            return;
        }
        console.log("Connection to database was succeed");

    });

    return connection;
}

