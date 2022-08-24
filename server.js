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
            choices: ["View all departments", "View all roles", "View all employees", "Add a department", "Add a role", "Add an employee", "Update an employee role", "Update an employee manager", "Delete a department", "Delete a role", "Quit"]
        },
    ])
        .then((result) => {
            if (result.menu === "View all departments") {
                viewDeprtments();
            } else if (result.menu === "View all roles") {
                viewRoles();
            } else if (result.menu === "View all employees") {
                viewEmployees();
            } else if (result.menu === "Add a department") {
                addDepartment();
            } else if (result.menu === "Add a role") {
                addRole();
            } else if (result.menu === "Add an employee") {
                addEmployee();
            } else if (result.menu === "Update an employee role") {
                updateRole();
            } else if (result.menu === "Update an employee manager") {
                updateManager();
            } else if (result.menu === "Delete a department") {
                deleteDepartment();
            } else if (result.menu === "Delete a role") {
                deleteRole();
            } else {
                init();
            }
        });
};

const viewDeprtments = () => {
    const sql = 'SELECT * FROM department GROUP BY name';
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else if (result) {
            console.table(result);
            menu();
        }
    })
};

const viewRoles = () => {
    const sql = 'SELECT  r.id, r.title, d.name as department, r.salary FROM role AS r INNER JOIN department AS d ON r.department_id = d.id GROUP BY r.title';
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else if (result) {
            console.table(result);
            menu();
        }
    })
};

const viewEmployees = () => {
    const sql = 'SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, " ", m.last_name) AS manager FROM employee e LEFT JOIN employee m ON m.id = e.manager_id INNER JOIN role r ON e.role_id = r.id INNER JOIN department d ON r.department_id = d.id GROUP BY e.first_name, e.last_name';
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else if (result) {
            console.table(result);
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

    db.query(`SELECT * FROM department GROUP BY name`, (err, result) => {
        if (err) {
            console.log(err);
        }

        for (let i = 0; i < result.length; i++) {
            departments.push(result[i].name)

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

    db.query(`SELECT * FROM role`, (err, result) => {
        if (err) {
            console.log(err);
        }

        for (let i = 0; i < result.length; i++) {
            roles.push(result[i].title);
        }

        let employees = [];

        db.query(`SELECT * FROM employee`, (err, result) => {
            if (err) {
                console.log(err);
            }

            for (let i = 0; i < result.length; i++) {
                employees.push(result[i].first_name + " " + result[i].last_name);
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
    db.query(`SELECT * FROM employee GROUP BY first_name, last_name`, (err, result) => {
        if (err) {
            console.log(err);
        }

        let employees = [];

        for (let i = 0; i < result.length; i++) {
            employees.push(result[i].first_name + " " + result[i].last_name)
        }

        db.query(`SELECT * FROM role GROUP BY title`, (err, result) => {
            if (err) {
                console.log(err);
            }

            let roles = [];

            for (let i = 0; i < result.length; i++) {
                roles.push(result[i].title)
            }

            return inquirer.prompt([
                {
                    type: "list",
                    name: "employee_id",
                    message: "Please select which employee's role you would like to update.",
                    choices: employees
                },
                {
                    type: "list",
                    name: "role_id",
                    message: "Please select the new role for the employee.",
                    choices: roles
                }
            ])
                .then(function ({ employee_id, role_id }) {
                    const sql = `UPDATE employee SET role_id = ${roles.indexOf(role_id) + 1} WHERE id = ${employees.indexOf(employee_id) + 1}`
                    db.query(sql, (err, result) => {
                        if (err) {
                            console.log(err);
                        } else if (result) {
                            console.log(result);
                            menu();
                        }
                    })
                })
        })

    })
}

const updateManager = () => {
    db.query(`SELECT * FROM employee`, function (err, result) {
        if (err) {
            console.log(err);
        }

        let employees = [];

        for (let i = 0; i < result.length; i++) {
            employees.push(result[i].first_name + " " + result[i].last_name)
        }

        return inquirer.prompt([
            {
                type: "list",
                name: "employee_id",
                message: "Please select which employee's manager you would like to update.",
                choices: employees
            },
            {
                type: "list",
                name: "manager_id",
                message: "Please select the new manager for the employee.",
                choices: ["null"].concat(employees)
            }
        ])
            .then(({ employee_id, manager_id }) => {
                if (manager_id === "null") {
                    const sql = `UPDATE employee SET manager_id = ${null} WHERE id = ${employees.indexOf(employee_id) + 1}`;
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
                    const sql = `UPDATE employee SET manager_id = ${employees.indexOf(manager_id) + 1} WHERE id = ${employees.indexOf(employee_id) + 1}`;
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
    })

}

const deleteDepartment = () => {
    const sql = `SELECT * FROM department GROUP BY name`;
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        }

        let departments = [];

        for (let i = 0; i < result.length; i++) {
            departments.push(result[i].name)
        }

        return inquirer.prompt([
            {
                type: "list",
                name: "name",
                message: "Please select which department would you like to delete.",
                choices: departments
            }
        ])
            .then(( {name} ) => {

                let deletedRow = `${name}`;

                const sql = `DELETE FROM department WHERE name = ?`;
                db.query(sql, deletedRow, (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(result);
                        console.log("Successfully deleted department!");
                        menu();
                    }
                })
            })

    })
}

const deleteRole = () => {
    const sql = `SELECT * FROM role GROUP BY title`;
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        }

        let roles = [];

        for (let i = 0; i < result.length; i++) {
            roles.push(result[i].title)
        }

        return inquirer.prompt([
            {
                type: "list",
                name: "title",
                message: "Please select which role would you like to delete.",
                choices: roles
            }
        ])
            .then(( {title} ) => {

                let deletedRow = `${title}`;

                const sql = `DELETE FROM role WHERE title = ?`;
                db.query(sql, deletedRow, (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(result);
                        console.log("Successfully deleted role!");
                        menu();
                    }
                })
            })

    })
}

const init = () => {
    db.end();
    console.log('Successfully ended!');
};

menu();