import express from 'express';
import pool from '../db.js';
import { authenticateToken } from './auth.js';
import { promisify } from 'util';

const router = express.Router();
const queryPromise = promisify(pool.query).bind(pool);

router.get('/', authenticateToken, (req, res) => {
    const { skip = 0, take = 10 } = req.query;
    const offset = parseInt(skip) || 0;
    const limit = parseInt(take) || 10;

    const countSql = 'SELECT COUNT(*) AS totalCount FROM employees';

    pool.query(countSql, [], async (err, countRows) => {
        if (err) return res.status(500).json({ message: 'Server error on count' });
        let totalCount = countRows[0].totalCount;

        if (totalCount === 0) {
            try {
                const response = await fetch('https://dummyjson.com/users');
                const data = await response.json();
                
                await Promise.all(
                    data.users.map(
                        (user) =>
                            new Promise((resolve, reject) => {
                                pool.query(
                                    'INSERT INTO employees(id, username, email, bgInfo) VALUES(?, ?, ?, ?)',
                                    [user.id, user.username, user.email, JSON.stringify({})],
                                    (err) => (err ? reject(err) : resolve())
                                );
                            })
                    )
                );

                const recountRows = await queryPromise('SELECT COUNT(*) AS totalCount FROM employees');
                totalCount = recountRows[0].totalCount;
                fetchData(totalCount);

            } catch (seedError) {
                return res.status(500).json({ message: 'Server error during seeding' });
            }

        } else {
            fetchData(totalCount);
        }

        function fetchData(finalTotalCount) {
            const dataSql = `
                SELECT * FROM employees
                ORDER BY id ASC
                LIMIT ? OFFSET ?
            `;
            const dataValues = [limit, offset];
            
            pool.query(dataSql, dataValues, (err, rows) => {
                if (err) return res.status(500).json({ message: 'Server error on data fetch' });

                const employees = rows.map((row) => ({
                    id: row.id,
                    username: row.username,
                    email: row.email,
                    bgInfo: row.bgInfo ? JSON.parse(row.bgInfo) : {},
                }));

                return res.json({
                    data: employees,
                    totalCount: finalTotalCount,
                });
            });
        }
    });
});

router.get('/:id', authenticateToken, (req, res) => {
    const { id } = req.params;

    pool.query('SELECT * FROM employees WHERE id=?', [id], (err, rows) => {
        if (err) return res.status(500).json({ message: 'Server error' });
        if (!rows.length) return res.status(404).json({ message: 'Employee not found' });

        const employee = rows[0];
        employee.bgInfo = employee.bgInfo ? JSON.parse(employee.bgInfo) : {};
        res.json(employee);
    });
});

router.post('/', (req, res) => {
    const { username, email, bgInfo } = req.body;

    pool.query(
        'INSERT INTO employees(username, email, bgInfo) VALUES (?, ?, ?)',
        [username, email, bgInfo ? JSON.stringify(bgInfo) : JSON.stringify({})],
        (err, result) => {
            if (err) return res.status(500).json({ message: 'Server error' });
            res.status(201).json({ id: result.insertId, username, email, bgInfo: bgInfo || {} });
        }
    );
});

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { username, email, bgInfo } = req.body;

    pool.query(
        'UPDATE employees SET username=?, email=?, bgInfo=? WHERE id=?',
        [username, email, bgInfo ? JSON.stringify(bgInfo) : JSON.stringify({}), id],
        (err, result) => {
            if (err) return res.status(500).json({ message: 'Server error' });
            if (result.affectedRows === 0) return res.status(404).json({ message: 'Employee not found' });
            res.json({ id: parseInt(id), username, email, bgInfo: bgInfo || {} });
        }
    );
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;

    pool.query('DELETE FROM employees WHERE id=?', [id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Server error' });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Employee not found' });
        res.json({ message: 'Employee deleted successfully' });
    });
});

router.put('/:id/bginfo', (req, res) => {
    const { id } = req.params;
    const { bgInfo } = req.body;

    if (!bgInfo || typeof bgInfo !== 'object') return res.status(400).json({ message: 'Invalid bgInfo payload' });

    pool.query('SELECT * FROM employees WHERE id=?', [id], (err, rows) => {
        if (err) return res.status(500).json({ message: 'Server error' });
        if (!rows.length) return res.status(404).json({ message: 'Employee not found' });

        const employee = rows[0];
        const existingBgInfo = employee.bgInfo ? JSON.parse(employee.bgInfo) : {};
        const updatedBgInfo = { ...existingBgInfo, ...bgInfo };
        
        if (updatedBgInfo.startDate) updatedBgInfo.startDate = new Date(updatedBgInfo.startDate).toISOString().split('T')[0];
        if (updatedBgInfo.endDate) updatedBgInfo.endDate = new Date(updatedBgInfo.endDate).toISOString().split('T')[0];
        
        pool.query('UPDATE employees SET bgInfo=? WHERE id=?', [JSON.stringify(updatedBgInfo), id], (err) => {
            if (err) return res.status(500).json({ message: 'Server error' });
            res.json({ id: parseInt(id), username: employee.username, email: employee.email, bgInfo: updatedBgInfo });
        });
    });
});

export const employeeRouter = router;
