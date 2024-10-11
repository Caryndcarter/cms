"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connection_js_1 = require("./connection.js");
const inquirer_1 = __importDefault(require("inquirer"));
(0, connection_js_1.connectToDb)();
// Prompt user for data using Inquirer
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
            console.log("viewing departments");
        }
        else if (answers.selectedView === "View all roles") {
            console.log("vieweing all roles");
        }
        else if (answers.selectedView === "View all employees") {
            console.log("vieweing all employees");
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
        console.log(`console.logging the answers ${answers}`);
        const sql = `SELECT * FROM department`;
        connection_js_1.pool.query(sql, (err, result) => {
            if (err) {
                console.error('Error updating record:', err);
            }
            else {
                console.log(`console.logging the answers ${result}`);
            }
        });
    });
}
;
askForViewChoice();
