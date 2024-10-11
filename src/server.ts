/*import { Pool } from 'pg';
import inquirer from 'inquirer';

// Create a Postgres connection pool
const pool = new Pool({
  user: 'your_db_user',
  host: 'localhost',
  database: 'your_db_name',
  password: 'your_password',
  port: 5432,
});

// Function to prompt the user for input
async function promptUser() {
  const questions = [
    {
      type: 'input',
      name: 'id',
      message: 'Enter the ID of the user you want to update:',
    },
    {
      type: 'input',
      name: 'name',
      message: 'Enter the new name:',
    },
    {
      type: 'input',
      name: 'age',
      message: 'Enter the new age:',
    },
  ];
  
  return inquirer.prompt(questions);
}

// Function to update the database
async function updateUser(id: number, name: string, age: number) {
  const client = await pool.connect(); // Get a client from the pool
  try {
    const query = 'SELECT * FROM ';
    const values = [name, age, id];

    const res = await client.query(query, values);

    if (res.rowCount > 0) {
      console.log('User updated successfully!');
    } else {
      console.log('User not found.');
    }
  } catch (err) {
    console.error('Error updating user:', err);
  } finally {
    client.release(); // Release the client back to the pool
  }
}

// Main function to combine prompting and updating
async function main() {
  try {
    const answers = await promptUser();
    const { id, name, age } = answers;

    await updateUser(Number(id), name, Number(age));
  } catch (err) {
    console.error('Error in main function:', err);
  } finally {
    await pool.end(); // End the pool when done
  }
}

main();


*/