import { createPool } from "mysql";
import dotenv from "dotenv";
dotenv.config();
const pool = createPool({
    host:process.env.DB_HOST || "localhost",
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:'employee_db',
    connectionLimit:10,
});
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to the database:', err);
    }
 
    console.log('Database connected successfully.');

    connection.query('create database if not exists employee_db', (err) => {
        if (err) {
            console.error('Error creating database:', err); 
        } 
            console.log('Database employee_db ensured.');
            connection.query(`use employee_db`, (err) => {
                if (err) {
                    console.error('Error using database:', err);
                } else {
                    connection.query(`CREATE TABLE IF NOT EXISTS employees (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        username VARCHAR(255) NOT NULL,
                        email VARCHAR(255) NOT NULL,
                        bgInfo TEXT
                    )`, (err) => {
                        if (err) {
                            console.error('Error creating employees table:', err);
                        }
                        else {
                            console.log('Employees table ensured.');
                        }
                    });
                }
            });
        }
    
    );

});

export default pool;