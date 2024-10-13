"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connection_js_1 = require("./connection.js");
const inquirer_1 = __importDefault(require("inquirer"));
/*********************
 APP FUNCTIONS
*********************/
(0, connection_js_1.connectToDb)();
//Launch the app with the different inquirer choices to manage the company's employees. 
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
            console.log("Viewing all roles");
            getAllRoles();
        }
        else if (answers.selectedView === "View all employees") {
            console.log("Viewing all employees");
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
            employeeLoop();
        }
        else {
            quitApp();
        }
    });
}
;
//Quit the app if you want to exit 
function quitApp() {
    console.log("Exiting the application. Goodbye!");
    process.exit(0); // Exit with a success code (0)
}
;
/*********************
 DEPARTMENT FUNCTIONS
*********************/
//Get all departments, display them, and then start the app over again
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
//Add a new department 
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
/*********************
 ROLE FUNCTIONS
*********************/
//Get all roles and display them in a table and then start the app over again
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
//Add a new role 
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
        const sql = `INSERT INTO role (title, salary, department ) VALUES ($1, $2, $3)`;
        const params = [answer.role_title, answer.role_salary, answer.department];
        //answer.department will come through as a numeric value, the id because of how inquirer will process that object
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
/*********************
 EMPLOYEE FUNCTIONS
*********************/
//Get all employees, display them and start the app over again. 
function getallEmployees() {
    const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name as department, m.first_name as manager_first_name, m.last_name as manager_last_name
        FROM employee 
        JOIN role ON employee.role_id = role.id 
        JOIN department ON role.department = department.id
        LEFT JOIN employee m ON employee.manager_id = m.id`;
    //employee is renamed as m for manager, LEFT JOIN because sometimes manager is NULL
    connection_js_1.pool.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        }
        else if (result) {
            console.table(result.rows); //displays the employees
            //starts the app over again 
            askForChoice();
        }
    });
}
;
//Add new employee, take in the role names and maanger names as objects from the Loop functions below. 
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
        const params = [answer.employee_first_name, answer.employee_last_name, answer.role, answer.manager];
        //answer.role and answer.manager will come through as a numeric values, the id because of how inquirer will process that object
        connection_js_1.pool.query(sql, params, (err, result) => {
            if (err) {
                console.log(err);
            }
            else if (result) {
                console.log(`Your new employee ${answer.employee_first_name} ${answer.employee_last_name} has been added.`);
                //display all employees to verify that the employee has been added. 
                getallEmployees();
            }
        });
    });
}
;
//Update an existing employee's role to another existing role, take in the employee names and role names as objects from the Loop functions below. 
function updateEmployee(employeeNames, roleNames) {
    inquirer_1.default
        .prompt([
        {
            type: 'list',
            name: 'employee',
            message: 'Select the employee whose role you want to update.',
            choices: employeeNames
        },
        {
            type: 'list',
            name: 'role',
            message: 'Enter the role you want to update it to',
            choices: roleNames
        }
    ]).then((answer) => {
        const sql = `UPDATE employee SET role_id = $1 WHERE id = $2`;
        const params = [answer.role, answer.employee];
        //answer.role and answer.employee will come through as a numeric values, the id because of how inquirer will process that object
        connection_js_1.pool.query(sql, params, (err, result) => {
            if (err) {
                console.log(err);
            }
            else if (result) {
                console.log(`Your employee has been given the new role.`);
                //display all employees to verify that the employee has been updated. 
                getallEmployees();
            }
        });
    });
}
;
/*********************
 LOOP FUNCTIONS
*********************/
//Loop through the departemnts in order to make them a dropdown of choices, fed to the AddRole function
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
//Loop through all the employees and find the manager names and feed it to the roleLoop function.
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
            const newName = `${row.first_name} ${row.last_name}`;
            managerNames.push({ name: newName, value: row.id });
        }
        roleLoop(managerNames);
    });
}
//Loop thorugh all the roles to find the role names and provie a dropdown for the addEmployee function, include the manager names in the pass
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
//Loop through all the employees to find the employee names and pass those to the employeeNames function. 
function employeeLoop() {
    const sql = 'SELECT * FROM employee';
    connection_js_1.pool.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        }
        else if (result) {
            //console.table(result.rows);
        }
        const employeeNames = [];
        for (const row of result.rows) {
            const newName = `${row.first_name} ${row.last_name}`;
            employeeNames.push({ name: newName, value: row.id });
        }
        roleLoop2(employeeNames);
    });
}
//Lopp through all the roles to find the role name to add to the dropdown in the updateEmployee function 
function roleLoop2(employeeNames) {
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
        updateEmployee(employeeNames, roleNames);
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
askForChoice();
