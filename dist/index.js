"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connection_js_1 = require("./connection.js");
const inquirer_1 = __importDefault(require("inquirer"));
(0, connection_js_1.connectToDb)();
function startCLI() {
    askForChoice();
}
;
function getAllDepartments() {
    const sql = 'SELECT * FROM department';
    connection_js_1.pool.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        }
        else if (result) {
            console.table(result.rows);
            askForChoice();
        }
    });
}
;
function getRoles() {
    const sql = `SELECT * from role`;
    connection_js_1.pool.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        }
        else if (result) {
            console.table(result.rows);
            askForChoice();
        }
    });
}
;
function getEmployees() {
    const sql = `SELECT * from employee`;
    connection_js_1.pool.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        }
        else if (result) {
            console.table(result.rows);
            askForChoice();
        }
    });
}
;
function getAllRoles() {
    const sql = `SELECT role.id, role.title, role.salary, department.name as department_name 
        FROM role 
        JOIN department ON role.department = department.id`;
    connection_js_1.pool.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        }
        else if (result) {
            console.table(result.rows);
            askForChoice();
        }
    });
}
;
function getallEmployees() {
    const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name as department 
        FROM employee 
        JOIN role ON employee.role_id = role.id 
        JOIN department ON role.department = department.id`;
    connection_js_1.pool.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        }
        else if (result) {
            console.table(result.rows);
            askForChoice();
        }
    });
}
;
function addDepartment() {
    inquirer_1.default
        .prompt([
        {
            type: 'input',
            name: 'department',
            message: 'Enter the name of a department'
        }
    ]).then((answer) => {
        const sql = `INSERT INTO department (name) VALUES ($1)`;
        const params = [answer.department];
        connection_js_1.pool.query(sql, params, (err, result) => {
            if (err) {
                console.log(err);
            }
            else if (result) {
                console.log(`Your new department: ${answer.department} has been added.`);
                getAllDepartments();
            }
        });
    });
}
;
function addRole() {
    inquirer_1.default
        .prompt([
        {
            type: 'input',
            name: 'role_title',
            message: 'Enter the title of a new role',
        },
        {
            type: 'input',
            name: 'role_salary',
            message: 'Enter the salary for the role',
        },
    ]).then((answer) => {
        const sql = `INSERT INTO role (title, salary) VALUES ($1, $2)`;
        const params = [answer.role_title, answer.role_salary];
        connection_js_1.pool.query(sql, params, (err, result) => {
            if (err) {
                console.log(err);
            }
            else if (result) {
                console.log(`Your new department: ${answer.role_title} has been added.`);
                getRoles();
            }
        });
    });
}
;
function addEmployee() {
    inquirer_1.default
        .prompt([
        {
            type: 'input',
            name: 'employee_first_name',
            message: 'Enter the first name of the new employee.',
        },
        {
            type: 'input',
            name: 'employee_last_name',
            message: 'Enter the last name of the new employee.',
        },
    ]).then((answer) => {
        const sql = `INSERT INTO employee (first_name, last_name) VALUES ($1, $2)`;
        const params = [answer.employee_first_name, answer.employee_last_name];
        connection_js_1.pool.query(sql, params, (err, result) => {
            if (err) {
                console.log(err);
            }
            else if (result) {
                console.log(`Your new employee ${answer.employee_first_name} ${answer.employee_last_name} has been added.`);
                getEmployees();
            }
        });
    });
}
;
function updateEmployee() {
    getallEmployees();
}
;
function quitApp() {
    console.log("Exiting the application. Goodbye!");
    process.exit(0); // Exit with a success code (0)
}
;
function askForChoice() {
    inquirer_1.default
        .prompt([
        {
            type: 'list',
            name: 'selectedView',
            message: 'What would you like to do?',
            choices: ["View all departments", "View all roles", "View all employees", "Add a department", "Add a role", "Add an employee", "Update an employee role", "Quit"],
        },
    ])
        .then((answers) => {
        if (answers.selectedView === "View all departments") {
            console.log("Viewing departments");
            getAllDepartments();
        }
        else if (answers.selectedView === "View all roles") {
            console.log("Vieweing all roles");
            getAllRoles();
        }
        else if (answers.selectedView === "View all employees") {
            console.log("Vieweing all employees");
            getallEmployees();
        }
        else if (answers.selectedView === "Add a department") {
            console.log("Add department");
            addDepartment();
        }
        else if (answers.selectedView === "Add a role") {
            console.log("Add a role");
            addRole();
        }
        else if (answers.selectedView === "Add an employee") {
            console.log("Add an employee");
            addEmployee();
        }
        else if (answers.selectedView === "Update an employee role") {
            console.log("Update an employee");
            updateEmployee();
        }
        else {
            quitApp();
        }
    });
}
;
startCLI();
