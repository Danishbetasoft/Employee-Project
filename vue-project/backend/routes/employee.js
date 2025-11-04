import express from 'express';
import { authenticateToken } from './auth.js';
import { Employee } from '../models/employee.js';
import { AppDataSource } from '../DB/dataSource.js';

const router = express.Router();
const employeeRepository = AppDataSource.getRepository(Employee);

router.get('/public/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await employeeRepository.findOneBy({ id: parseInt(id) });
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json(employee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/', authenticateToken, async (req, res) => {
  const skip = req.query.skip;
  const take = req.query.take;
  const { sort, requireTotalCount } = req.query;

  try {
    let totalCount = 0;
    const fetchTotalCount = requireTotalCount === 'true';

    if (fetchTotalCount) {
      totalCount = await employeeRepository.count();
    }

    let orderBy = { id: 'ASC' };
    if (sort) {
      try {
        const sortArray = JSON.parse(sort);
        if (sortArray.length) {
          const [sortField] = sortArray;
          orderBy = { [sortField.selector]: sortField.desc ? 'DESC' : 'ASC' };
        }
      } catch {}
    }

    const employees = await employeeRepository.find({
      skip,
      take,
      order: orderBy,
    });

    const responseData = { data: employees };
    if (fetchTotalCount) responseData.totalCount = totalCount;

    res.json(responseData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error on data fetch' });
  }
});

router.get('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await employeeRepository.findOneBy({ id: parseInt(id) });
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json(employee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  const { username, email, bgInfo } = req.body;
  try {
    const newEmployee = employeeRepository.create({
      username,
      email,
      bgInfo: bgInfo || {},
    });
    await employeeRepository.save(newEmployee);
    res.status(201).json(newEmployee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { username, email, bgInfo } = req.body;
  try {
    const employee = await employeeRepository.findOneBy({ id: parseInt(id) });
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    employee.username = username || employee.username;
    employee.email = email || employee.email;

    if (bgInfo && typeof bgInfo === 'object') {
      employee.bgInfo = { ...employee.bgInfo, ...bgInfo };
    }

    await employeeRepository.save(employee);
    res.json(employee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await employeeRepository.delete({ id: parseInt(id) });
    if (result.affected === 0) return res.status(404).json({ message: 'Employee not found' });
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id/bginfo', async (req, res) => {
  const { id } = req.params;
  const { bgInfo } = req.body;
  if (!bgInfo || typeof bgInfo !== 'object')
    return res.status(400).json({ message: 'Invalid bgInfo payload' });

  try {
    const employee = await employeeRepository.findOneBy({ id: parseInt(id) });
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    const existingBgInfo = employee.bgInfo || {};
    const updatedBgInfo = { ...existingBgInfo, ...bgInfo };

    if (updatedBgInfo.startDate)
      updatedBgInfo.startDate = new Date(updatedBgInfo.startDate).toISOString().split('T')[0];
    if (updatedBgInfo.endDate)
      updatedBgInfo.endDate = new Date(updatedBgInfo.endDate).toISOString().split('T')[0];

    employee.bgInfo = updatedBgInfo;
    await employeeRepository.save(employee);

    res.json(employee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export const employeeRouter = router;
