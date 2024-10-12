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
    connection_js_1.pool.query('SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary FROM employee JOIN role ON employee.role_id = role.id', (err, result) => {
        if (err) {
            console.log(err);
        }
        else if (result) {
            console.table(result.rows);
        }
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
            console.log("vieweing all employees");
            getallEmployees();
        }
        else if (answers.selectedView === "Add a department") {
            console.log("add department");
        }
        else if (answers.selectedView === "Add a role") {
            console.log("add a role");
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
