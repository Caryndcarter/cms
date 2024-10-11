import { QueryResult } from 'pg';
import { pool, connectToDb } from './connection.js';
import inquirer from 'inquirer';

await connectToDb();




// Prompt user for data using Inquirer
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
                console.log("viewing departments"); 
            } else if (answers.selectedView === "View all roles") {
                console.log("vieweing all roles"); 
            } else if (answers.selectedView === "View all employees") {
                console.log("vieweing all employees"); 
            } else if (answers.selectedView === "Add a department") {
                console.log("add department"); 
            } else if (answers.selectedView === "Add a role") {
                console.log("add a role"); 
            } else if (answers.selectedView === "Add an employee") {
                console.log("add an employee"); 
            } else {
                console.log("update an employee")
            }

            console.log(`console.logging the answers ${answers}`); 

            const sql = `SELECT * FROM department`;

            pool.query(sql, (err: Error, result: QueryResult) => {
              if (err) {
                console.error('Error updating record:', err);
              } else {
                console.log(`console.logging the answers ${result}`); 
              }
               
            });
        });
}; 

askForViewChoice()

