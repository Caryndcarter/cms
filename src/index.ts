import { QueryResult } from 'pg';
import { pool, connectToDb } from './connection.js';
import inquirer from 'inquirer';

connectToDb();
  
function startCLI() {
    askForViewChoice(); 

};



function getAllDepartments () {
    const sql = 'SELECT * FROM department';
    pool.query(sql, (err: Error, result: QueryResult) => {
        if (err) {
          console.log(err);
        } else if (result) {
          console.table(result.rows);
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
                console.log("added");
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
               console.log("added");
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
               console.log("added");
             }
           });    
   });
};


function updateEmployee () {
    getallEmployees(); 
}

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
                console.log("Vieweing all employees"); 
                getallEmployees(); 
            } else if (answers.selectedView === "Add a department") {
                console.log("Add department"); 
                addDepartment(); 
            } else if (answers.selectedView === "Add a role") {
                console.log("Add a role"); 
                addRole(); 
            } else if (answers.selectedView === "Add an employee") {
                console.log("add an employee"); 
                addEmployee()
            } else {
                console.log("update an employee")
                updateEmployee(); 
            }

           //return;  

        });
}; 




startCLI();