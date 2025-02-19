const mysql = require("mysql2")
const dotenv = require("dotenv");
dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit:40,
    queueLimit: 50,
})
pool.getConnection((err,connection)=>{
    if(err){
        console.log(err)
        return
    }
    console.log("Connected to db with id:",connection.threadId)
    connection.release()
})

module.exports = pool