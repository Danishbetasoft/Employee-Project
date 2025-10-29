
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authRouter } from './routes/auth.js';
import { employeeRouter } from './routes/employee.js';

dotenv.config();
const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json());

app.use('/auth', authRouter);
app.use('/employees', employeeRouter);

app.listen(process.env.PORT || 3000, () => console.log('Server running...'));
