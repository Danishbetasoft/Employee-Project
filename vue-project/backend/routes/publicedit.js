import express from 'express';
import pool from '../db.js';



const router = express.Router();




router.put('/:id/bginfo', (req, res) => {
  const { id } = req.params;
  const { bgInfo } = req.body;

  pool.query('SELECT * FROM employees WHERE id=?', [id], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }
    if (!rows.length) return res.status(404).json({ message: 'Employee not found' });

    const employee = rows[0];
    const updatedBgInfo = { ...JSON.parse(employee.bgInfo || '{}'), ...bgInfo };

    pool.query(
      'UPDATE employees SET bgInfo=? WHERE id=?',
      [JSON.stringify(updatedBgInfo), id],
      (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Server error' });
        }
        res.json({ ...employee, bgInfo: updatedBgInfo });
      }
    );
  });
});

export const publicRouter = router;
