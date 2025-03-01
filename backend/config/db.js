const mysql = require('mysql2')

const conn = mysql.createConnection({
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASS,
    database: process.env.SQL_DB
})

conn.connect(err => {
    if (err) {
        console.log("Problem connecting to server", err)
    } else {
        console.log(`MYSQL Connected: ${conn.config.host}`.cyan.underline)
    }
})

module.exports = conn