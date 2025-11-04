import { Router } from 'express';
import { Employee } from '../models/employee.js';
import { AppDataSource } from '../DB/dataSource.cjs';

const employeeRepository = AppDataSource.getRepository(Employee);

const router = Router();

router.put('/:id/bginfo',async(req, res) => {
  const { id } = req.params;
  const { bgInfo } = req.body;
try{
  const employee = await employeeRepository.findOneBy({ id: parseInt(id) });
  if (!employee) return res.status(404).json({ message: 'Employee not found' });
  if (!bgInfo || typeof bgInfo !== 'object') return res.status(400).json({ meassage: 'Invalid bgInfo payload' });
  employee.bgInfo = { ...employee.bgInfo, ...bgInfo };
  await employeeRepository.save(employee);
  res.json(employee);
}catch(error){
  res.status(500).json({ message: 'Server error' });
}
});

export const publicRouter = router;
