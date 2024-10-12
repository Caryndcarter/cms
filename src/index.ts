import { QueryResult } from 'pg';
import { pool, connectToDb } from './connection.js';
import inquirer from 'inquirer';
import { get } from 'http';

connectToDb();
  
function startCLI() {
    askForChoice(); 

};



function getAllDepartments () {
    const sql = 'SELECT * FROM department';
    pool.query(sql, (err: Error, result: QueryResult) => {
        if (err) {
          console.log(err);
        } else if (result) {
          console.table(result.rows);
          askForChoice(); 
        }
      });
};


function getAllRoles () {
    const sql = 
        `SELECT role.id, role.title , role.salary, department.name as department_name 
        FROM role 
        JOIN department ON role.department = department.id`;
    pool.query(sql, (err: Error, result: QueryResult) => {
        if (err) {
          console.log(err);
        } else if (result) {
          console.table(result.rows);
          askForChoice(); 
        }
      });
};

function getallEmployees () {
    const sql = 
        `SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name as department 
        FROM employee 
        JOIN role ON employee.role_id = role.id 
        JOIN department ON role.department = department.id`
    pool.query(sql, (err: Error, result: QueryResult) => {
        if (err) {
          console.log(err);
        } else if (result) {
          console.table(result.rows);
          askForChoice();
       }
      });
};

function addDepartment () {
    inquirer 
     .prompt ([
        {
          type: 'input', 
          name: 'department', 
          message: 'Enter the name of a department'
        }
    ]).then((answer) => {
        console.log(answer.department); 
        const sql = `INSERT INTO department (name) VALUES ($1)`; 
        const params = [answer.department]; 
        
        pool.query(sql, params,(err: Error, result: QueryResult) => {
            if (err) {
                console.log(err);
              } else if (result) {
                console.log(`Your new department: ${answer.department} has been added.`)
                getAllDepartments(); 
              }
            }); 
   
    });
};


function addRole () {
    inquirer 
    .prompt ([
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
       
       pool.query(sql, params,(err: Error, result: QueryResult) => {
           if (err) {
               console.log(err);
             } else if (result) {
               console.log(`Your new role ${answer.role_title} has been added.`);
               getAllRoles(); 
             }
           });    
   });
};

function addEmployee () {
    inquirer 
    .prompt ([
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
       console.log(answer.employee_first_name); 
       const sql = `INSERT INTO employee (first_name, last_name) VALUES ($1, $2)`; 
       const params = [answer.employee_first_name, answer.employee_last_name]; 
       
       pool.query(sql, params,(err: Error, result: QueryResult) => {
           if (err) {
               console.log(err);
             } else if (result) {
               console.log(`Your new employee ${answer.employee_first_name} ${answer.employee_last_name} has been added.`);
               getallEmployees(); 
             }
           });    
   });
};


function updateEmployee () {
    getallEmployees(); 
};


function quitApp () {
    console.log("Exiting the application. Goodbye!");
    process.exit(0); 
};

function askForChoice(): void {
    inquirer   
        .prompt ([
            {
                type: 'list',
                name: 'selectedView',
                message: 'What would you like to do?',
                choices: ["View all departments", "View all roles", "View all employees", "Add a department", "Add a role", "Add an employee", "Update an employee role", "Quit"], 
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
                console.log("Vieweing all employees"); 
                getallEmployees(); 
            } else if (answers.selectedView === "Add a department") {
                console.log("Add department"); 
                addDepartment(); 
            } else if (answers.selectedView === "Add a role") {
                console.log("Add a role"); 
                addRole(); 
            } else if (answers.selectedView === "Add an employee") {
                console.log("Add an employee"); 
                addEmployee()
            } else if (answers.selectedView === "Update an employee role") {
                console.log("Update an employee")
                updateEmployee(); 
            } else {
                quitApp();  
            }
              
            

           //return;  

        });
}; 




startCLI();