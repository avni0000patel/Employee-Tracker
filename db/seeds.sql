USE employeeTracker_db;

INSERT INTO department (name)
VALUES ("Sales"),
       ("Engineering"),
       ("Finance"),
       ("Legal");

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Lead", 100000, 1),
       ("Salesperson", 80000, 1),
       ("Lead Engineer", 150000, 2),
       ("Software Engineer", 120000, 2),
       ("Account Manager", 160000, 3),
       ("Accountant", 125000, 3),
       ("Legal Team Lead", 250000, 4),
       ("Lawyer", 190000, 4);

INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUES ("Anna", "Lawson", NULL, 1),
       ("Brandon", "Smith", 1, 2),
       ("Cindy", "Turner", NULL, 3),
       ("Dan", "Peppers", 3, 4),
       ("Emmy", "Johnson", NULL, 5),
       ("Faith", "Erving", 5, 6),
       ("Gabe", "Rainer", NULL, 7),
       ("Hillary", "Duff", 7, 8);

SELECT * FROM department;

SELECT * FROM role;

SELECT * FROM employee;