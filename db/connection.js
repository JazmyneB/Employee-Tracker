const mysql = require('mysql2');

//connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // Your MySQL username
        user: 'root',
        //MYSQL PW
        password: 'L0vecoding!',
        database: 'Employees'
    },
    console.log('Connected to employees database.')
);

module.exports = db;