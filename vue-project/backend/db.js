import { createPool } from "mysql";
import dotenv from "dotenv";
dotenv.config();

const pool = createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "employee_db",
  connectionLimit: 10,
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }

  console.log("Database connected successfully.");
  connection.query("CREATE DATABASE IF NOT EXISTS employee_db", (err) => {
    if (err) {
      console.error(" Error creating database:", err);
      return;
    }

    console.log(" Database employee_db ensured.");

    connection.query("USE employee_db", (err) => {
      if (err) {
        console.error(" Error selecting database:", err);
        return;
      }

      const createEmployees = `
        CREATE TABLE IF NOT EXISTS employees (
          id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          bgInfo TEXT
        );
      `;

      const createMailRecords = `
        CREATE TABLE IF NOT EXISTS mail_records (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id BIGINT NULL,
          company_name VARCHAR(255),
          to_emails TEXT,
          cc_emails TEXT,
          bcc_emails TEXT,
          message TEXT,
          tracking_id VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;

      const createMailEvents = `
        CREATE TABLE IF NOT EXISTS mail_events (
          id BIGINT AUTO_INCREMENT PRIMARY KEY,
          user_id BIGINT NULL,
          form_id BIGINT,
          event_type ENUM('sent','opened','clicked'),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;

      connection.query(createEmployees, (err) => {
        if (err) console.error(" Error creating employees table:", err);
        else console.log("Employees table ensured.");

        connection.query(createMailRecords, (err) => {
          if (err) console.error(" Error creating mail_records table:", err);
          else console.log(" Mail_Records table ensured.");

          connection.query(createMailEvents, (err) => {
            if (err) console.error(" Error creating mail_events table:", err);
            else console.log(" Mail_Events table ensured.");
          });
        });
      });
    });
  });
});

export default pool;
