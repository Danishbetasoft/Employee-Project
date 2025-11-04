import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authRouter } from './routes/auth.js';
import { employeeRouter } from './routes/employee.js';
import mailerRoutes from "./routes/mail.js";
import trackerRoutes from "./routes/track.js";
import 'reflect-metadata';
import { AppDataSource } from './DB/dataSource.js';
import { Employee } from './models/employee.js';

dotenv.config();
const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json());

async function seedEmployees() {
  const employeeRepository = AppDataSource.getRepository(Employee);
  const count = await employeeRepository.count();
  if (count === 0) {
    const response = await fetch('https://dummyjson.com/users');
    const data = await response.json();
    const employees = data.users.map((user) => ({
      username: user.username,
      email: user.email,
      bgInfo: {},
    }));
    await employeeRepository.save(employees);
    console.log('Seeded employee data.');
  }
}

try {
  await AppDataSource.initialize();
  await seedEmployees();

  app.use('/auth', authRouter);
  app.use('/employees', employeeRouter);
  app.use('/mail', mailerRoutes);
  app.use('/', trackerRoutes);

  app.listen(process.env.PORT || 3000, () => console.log('Server running...'));
} catch (err) {
  console.log("Error occurred during DB connection", err);
}
