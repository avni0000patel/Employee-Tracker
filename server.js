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

db.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

const menu = () => {
    return inquirer.prompt([
        {
            type: "list",
            name: "menu",
            message: "Please select one of the following options from the menu.",
            choices: ["View all departments", "View all roles", "View all employees", "Add a department", "Add a role", "Add an employee", "Update an employee role", "Quit"]
        },
    ])
        .then((data) => {
            if (data.menu === "View all departments") {
                viewDeprtments();
            } else if (data.menu === "View all roles") {
                viewRoles();
            } else if (data.menu === "View all employees") {
                viewEmployees();
            } else if (data.menu === "Add a department") {
                addDepartment();
            } else if (data.menu === "Add a role") {
                addRole();
            } else if (data.menu === "Add an employee") {
                addEmployee();
            } else if (data.menu === "Update an employee role") {
                updateRole();
            } else {
                init();
            }
        });
};

const viewDeprtments = () => {
    const sql = 'SELECT * FROM department GROUP BY name';
    db.query(sql, (err, data) => {
        if (err) {
            console.log(err);
        } else if (data) {
            console.table(data);
            menu();
        }
    })
};

const viewRoles = () => {
    const sql = 'SELECT  r.id, r.title, d.name as department, r.salary FROM role AS r INNER JOIN department AS d ON r.department_id = d.id GROUP BY r.title';
    db.query(sql, (err, data) => {
        if (err) {
            console.log(err);
        } else if (data) {
            console.table(data);
            menu();
        }
    })
};

const viewEmployees = () => {
    const sql = 'SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, " ", m.last_name) AS manager FROM employee e LEFT JOIN employee m ON m.id = e.manager_id INNER JOIN role r ON e.role_id = r.id INNER JOIN department d ON r.department_id = d.id GROUP BY e.first_name, e.last_name';
    db.query(sql, (err, data) => {
        if (err) {
            console.log(err);
        } else if (data) {
            console.table(data);
            menu();
        }
    })
};

const addDepartment = () => {
    return inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "What is the department's name?"
        }
    ])
        .then(function ({ name }) {
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
};

const addRole = () => {
    let departments = []

    db.query(`SELECT * FROM department GROUP BY name`, (err, data) => {
        if (err) {
            console.log(err);
        }

        for (let i = 0; i < data.length; i++) {
            departments.push(data[i].name)

        }

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
                type: "list",
                name: "department_id",
                message: "What is the role's department?",
                choices: departments
            }
        ])
            .then(function ({ title, salary, department_id }) {
                let departmentName = departments.indexOf(department_id);
                console.log(departmentName);

                const sql = `INSERT INTO role (title, salary, department_id) VALUES ( '${title}', '${salary}', '${departmentName}' )`;
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
    })
};

const addEmployee = () => {
    let roles = [];

    db.query(`SELECT * FROM role`, (err, data) => {
        if (err) {
            console.log(err);
        }

        for (let i = 0; i < data.length; i++) {
            roles.push(data[i].title);
        }

        let employees = [];

        db.query(`SELECT * FROM employee`, (err, data) => {
            if (err) {
                console.log(err);
            }

            for (let i = 0; i < data.length; i++) {
                employees.push(data[i].first_name + " " + data[i].last_name);
            }

            return inquirer.prompt([
                {
                    type: "input",
                    name: "first_name",
                    message: "What is the employee's first name?"
                },
                {
                    type: "input",
                    name: "last_name",
                    message: "What is the employee's last name?"
                },
                {
                    type: "list",
                    name: "manager_id",
                    message: "What is the manager's name?",
                    choices: ["null"].concat(employees)
                },
                {
                    type: "list",
                    name: "role_id",
                    message: "What is the role?",
                    choices: roles
                }
            ])
                .then(function ({ first_name, last_name, manager_id, role_id }) {
                    let roleName = roles.indexOf(role_id);
                    let managerName = employees.indexOf(manager_id);
                    if (manager_id === "null") {
                        const sql = `INSERT INTO employee (first_name, last_name, manager_id, role_id) VALUES ( '${first_name}', '${last_name}', 'null', '${roleName}' )`;
                        db.query(sql, (err, result) => {
                            if (err) {
                                console.log(err);
                            } else if (result) {
                                console.log(result);
                                console.log("Added employee");
                                menu();
                            }
                        })
                    } else {
                        const sql = `INSERT INTO employee (first_name, last_name, manager_id, role_id) VALUES ( '${first_name}', '${last_name}', '${managerName}', '${roleName}' )`;
                        db.query(sql, (err, result) => {
                            if (err) {
                                console.log(err);
                            } else if (result) {
                                console.log(result);
                                console.log("Added employee");
                                menu();
                            }
                        })
                    }
                })

        });
    });
};

const updateRole = () => {
    db.query(`SELECT * FROM employee GROUP BY first_name, last_name`, (err, data) => {
        if (err) {
            console.log(err);
        }

        let employees = [];

        for (let i = 0; i < data.length; i++) {
            employees.push(data[i].first_name + " " + data[i].last_name)
        }

        db.query(`SELECT * FROM role GROUP BY title`, (err, data) => {
            if (err) {
                console.log(err);
            }

            let roles = [];

            for (let i = 0; i < data.length; i++) {
                roles.push(data[i].title)
            }

            return inquirer.prompt([
                {
                    name: 'employee_id',
                    message: "Please select which employee's role you would like to update.",
                    type: 'list',
                    choices: employees
                },
                {
                    name: 'role_id',
                    message: "Please select the new role for the employee.",
                    type: 'list',
                    choices: roles
                }
            ])
                .then(function ({ employee_id, role_id }) {
                    const sql = `UPDATE employee SET role_id = ${roles.indexOf(role_id) + 1} WHERE id = ${employees.indexOf(employee_id) + 1}`
                    db.query(sql, (err, data) => {
                        if (err) {
                            console.log(err);
                        } else if (data) {
                            console.log(data);
                            menu();
                        }
                    })
                })
        })

    })
}

const init = () => {
    db.end();
    console.log('Successfully ended!');
};

menu();