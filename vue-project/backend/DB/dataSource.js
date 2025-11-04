import dotenv from 'dotenv';
import { DataSource } from 'typeorm'; 
import { Employee } from '../models/employee.js';
import { MailEvent } from '../models/mailEvent.js';
import { MailRecord } from '../models/mailRecords.js';
dotenv.config({ path: './backend/.env' });

const AppDataSource = new DataSource({
  type: 'mysql',  
  host: 'localhost',
  port: 3306, 
  username: process.env.DB_USER||'root', 
  password: process.env.DB_PASSWORD, 
  database: process.env.DB_NAME,
  synchronize: true,
  logging: true,
  entities: [Employee, MailRecord, MailEvent],
  migrations:
  ['./migrations']
});

export { AppDataSource };