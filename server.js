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

const menu = () => {
    return inquirer.prompt([
        {
            type: "list",
            message: "Please select one of the following options from the menu.",
            name: "menu",
            choices: ["View all employees", "Add employee", "Update employee role", "View all roles", "Add role", "View all departments", "Add department", "Quit"]
        },
    ])
        .then((data) => {
            if (data.menu === "View all employees") {
                console.log("View all employees");
            } else if (data.menu === "Add employee") {
                console.log("Add employee");
            } else if (data.menu === "Update employee role") {
                console.log("Update employee role");
            } else if (data.menu === "View all roles") {
                console.log("View all roles");
            } else if (data.menu === "Add role") {
                console.log("Add role");
            } else if (data.menu === "View all departments") {
                console.log("View all departments")
            } else if (data.menu === "Add department") {
                console.log("Add department");
            } else {
                init();
            }
        });
};

const init = () => {
    db.end();
    console.log('Successfully ended!');
};

menu();