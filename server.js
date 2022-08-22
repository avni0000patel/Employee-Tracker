const cTable = require('console.table');
const inquirer = require('inquirer');
const mysql = require('mysql2');

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'Watermelon-0!',
      database: 'employeeTracker_db'
    },
    console.log(`Connected to the employeeTracker_db database.`)
);

db.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});