import { QueryResult } from 'pg';
import { pool, connectToDb } from './connection.js';
import inquirer from 'inquirer';

connectToDb();
  
function startCLI() {
    askForViewChoice(); 

};



function getAllDepartments () {
    pool.query('SELECT * FROM department', (err: Error, result: QueryResult) => {
        if (err) {
          console.log(err);
        } else if (result) {
          console.table(result.rows);
        }
      });
};


function getAllRoles () {
    pool.query('SELECT role.id, role.title , role.salary, department.name as department_name FROM role JOIN department ON role.department = department.id', (err: Error, result: QueryResult) => {
        if (err) {
          console.log(err);
        } else if (result) {
          console.table(result.rows);
        }
      });
};

function getallEmployees () {
    pool.query('SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name as department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department = department.id', (err: Error, result: QueryResult) => {
        if (err) {
          console.log(err);
        } else if (result) {
          console.table(result.rows);
        }
      });
};




function askForViewChoice(): void {
    inquirer   
        .prompt ([
            {
                type: 'list',
                name: 'selectedView',
                message: 'What would you like to do?',
                choices: ["View all departments", "View all roles", "View all employees", "Add a department", "Add a role", "Add an employee", "Update an employee role"], 
            }, 
        ])
        .then ((answers) => {
            if(answers.selectedView === "View all departments") {
                console.log("Viewing departments"); 
                getAllDepartments(); 
            } else if (answers.selectedView === "View all roles") {
                console.log("Vieweing all roles"); 
                getAllRoles(); 
            } else if (answers.selectedView === "View all employees") {
                console.log("vieweing all employees"); 
                getallEmployees(); 
            } else if (answers.selectedView === "Add a department") {
                console.log("add department"); 
            } else if (answers.selectedView === "Add a role") {
                console.log("add a role"); 
            } else if (answers.selectedView === "Add an employee") {
                console.log("add an employee"); 
            } else {
                console.log("update an employee")
            }

            
            console.log(`console.logging the answers ${answers.selectedView}`); 
           //return;  

        });
}; 




startCLI();