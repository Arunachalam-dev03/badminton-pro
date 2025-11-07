import express from 'express'; import db from '../config/db.js'; import { auth, isAdmin } from '../middleware/auth.js';
const router = express.Router();

router.get('/', async (req,res)=>{ const { rows } = await db.query('SELECT * FROM courts ORDER BY name ASC'); res.json(rows); });
router.post('/', auth(), isAdmin, async (req,res)=>{ const { name, location } = req.body; const { rows } = await db.query('INSERT INTO courts (name,location) VALUES ($1,$2) RETURNING *',[name, location || null]); res.status(201).json(rows[0]); });

export default router;
