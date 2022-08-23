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
                addRole();
            } else if (data.menu === "View all departments") {
                console.log("View all departments")
            } else if (data.menu === "Add department") {
                addDepartment();
            } else {
                init();
            }
        });
};

const addDepartment = () => {
    return inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "What is the department's name?"
        }
    ])
        .then(function( {name} ) {
            const sql = `INSERT INTO department (name) VALUES ('${name}')`;
            db.query(sql, (err, result) => {
                if (err) {
                    console.log(err);
                } else if (result) {
                    console.log(result);
                    console.log("Added department");
                    menu();
                }
            })
        })
}

const addRole = () => {
    return inquirer.prompt([
        {
            type: "input",
            name: "title",
            message: "What is the role's name?"
        }, 
        {
            type: "input",
            name: "salary",
            message: "What is the role's salary?"
        }, 
        {
            type: "input", 
            name: "department_id",
            message: "what is the role's department id?"
        }
    ])
        .then(function( {title, salary, department_id} ) {
            const sql = `INSERT INTO role (title, salary, department_id) VALUES ( '${title}', '${salary}', '${department_id}' )`;
            db.query(sql, (err, result) => {
                if (err) {
                    console.log(err);
                } else if (result) {
                    console.log(result);
                    console.log("Added role");
                    menu();
                }
            })
        })
}

const init = () => {
    db.end();
    console.log('Successfully ended!');
};

menu();