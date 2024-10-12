"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connection_js_1 = require("./connection.js");
const inquirer_1 = __importDefault(require("inquirer"));
//import { get } from 'http';
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
function departmentLoop() {
    const sql = 'SELECT * FROM department';
    connection_js_1.pool.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        }
        else if (result) {
            //console.table(result.rows);
        }
        const departmentNames = [];
        for (const row of result.rows) {
            departmentNames.push({ name: row.name, value: row.id });
        }
        addRole(departmentNames);
    });
}
function managerLoop() {
    const sql = 'SELECT * FROM employee';
    connection_js_1.pool.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        }
        else if (result) {
            //console.table(result.rows);
        }
        const managerNames = [];
        for (const row of result.rows) {
            managerNames.push({ name: row.first_name, value: row.id });
        }
        roleLoop(managerNames);
    });
}
function roleLoop(managerNames) {
    const sql = 'SELECT * FROM role';
    connection_js_1.pool.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        }
        else if (result) {
            //console.table(result.rows);
        }
        const roleNames = [];
        for (const row of result.rows) {
            roleNames.push({ name: row.title, value: row.id });
        }
        addEmployee(roleNames, managerNames);
    });
}
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
    const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name as department, m.first_name as manager
        FROM employee 
        JOIN role ON employee.role_id = role.id 
        JOIN department ON role.department = department.id
        JOIN employee m ON employee.manager_id = m.id`;
    //employee is renamed as manager
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
function addRole(departmentNames) {
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
        {
            type: 'list',
            name: 'department',
            message: 'Enter the department for the role',
            choices: departmentNames
        }
    ]).then((answer) => {
        console.log(answer.department);
        const sql = `INSERT INTO role (title, salary, department ) VALUES ($1, $2, $3)`;
        const params = [answer.role_title, answer.role_salary, answer.department];
        connection_js_1.pool.query(sql, params, (err, result) => {
            if (err) {
                console.log(err);
            }
            else if (result) {
                console.log(`Your new role: ${answer.role_title} has been added.`);
                getAllRoles();
            }
        });
    });
}
;
function addEmployee(roleNames, managerNames) {
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
        {
            type: 'list',
            name: 'role',
            message: 'Enter the role for the employee',
            choices: roleNames
        },
        {
            type: 'list',
            name: 'manager',
            message: 'Enter the manager for the employee',
            choices: managerNames
        }
    ]).then((answer) => {
        const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)`;
        const params = [answer.employee_first_name, answer.employee_last_name, answer.manager, answer.role];
        connection_js_1.pool.query(sql, params, (err, result) => {
            if (err) {
                console.log(err);
            }
            else if (result) {
                console.log(`Your new employee ${answer.employee_first_name} ${answer.employee_last_name} has been added.`);
                //getEmployees(); 
                getallEmployees();
            }
        });
    });
}
;
function updateEmployee() {
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
            departmentLoop();
        }
        else if (answers.selectedView === "Add an employee") {
            console.log("Add an employee");
            managerLoop();
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
