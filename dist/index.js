"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connection_js_1 = require("./connection.js");
const inquirer_1 = __importDefault(require("inquirer"));
(0, connection_js_1.connectToDb)();
function startCLI() {
    askForViewChoice();
}
;
function getAllDepartments() {
    connection_js_1.pool.query('SELECT * FROM department', (err, result) => {
        if (err) {
            console.log(err);
        }
        else if (result) {
            console.table(result.rows);
        }
    });
}
;
function getAllRoles() {
    connection_js_1.pool.query('SELECT role.id, role.title , role.salary, department.name as department_name FROM role JOIN department ON role.department = department.id', (err, result) => {
        if (err) {
            console.log(err);
        }
        else if (result) {
            console.table(result.rows);
        }
    });
}
;
function getallEmployees() {
    connection_js_1.pool.query('SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name as department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department = department.id', (err, result) => {
        if (err) {
            console.log(err);
        }
        else if (result) {
            console.table(result.rows);
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
        console.log(answer.department);
        const sql = `INSERT INTO department (name) VALUES ($1)`;
        const params = [answer.department];
        connection_js_1.pool.query(sql, params, (err, result) => {
            if (err) {
                console.log(err);
            }
            else if (result) {
                console.log("added");
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
        console.log(answer.role_title);
        const sql = `INSERT INTO role (title, salary) VALUES ($1, $2)`;
        const params = [answer.role_title, answer.role_salary];
        connection_js_1.pool.query(sql, params, (err, result) => {
            if (err) {
                console.log(err);
            }
            else if (result) {
                console.log("added");
            }
        });
    });
}
;
function askForViewChoice() {
    inquirer_1.default
        .prompt([
        {
            type: 'list',
            name: 'selectedView',
            message: 'What would you like to do?',
            choices: ["View all departments", "View all roles", "View all employees", "Add a department", "Add a role", "Add an employee", "Update an employee role"],
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
            console.log("add an employee");
        }
        else {
            console.log("update an employee");
        }
        console.log(`console.logging the answers ${answers.selectedView}`);
        //return;  
    });
}
;
startCLI();
