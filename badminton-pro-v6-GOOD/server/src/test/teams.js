import express from 'express'; import db from '../config/db.js'; import { teamSchema } from '../utils/validators.js'; import { auth, isAdmin } from '../middleware/auth.js';
const router = express.Router();

router.get('/', async (req,res)=>{
  const { rows } = await db.query(`
    SELECT t.*, p1.name as p1, p2.name as p2
    FROM teams t
    LEFT JOIN players p1 ON p1.id=t.player1_id
    LEFT JOIN players p2 ON p2.id=t.player2_id
    ORDER BY t.elo DESC, t.wins DESC`);
  res.json(rows);
});

router.post('/', auth(), isAdmin, async (req,res)=>{
  const { value, error } = teamSchema.validate(req.body); if (error) return res.status(400).json({message:error.message});
  const { rows } = await db.query('INSERT INTO teams (name,player1_id,player2_id) VALUES ($1,$2,$3) RETURNING *', [value.name, value.player1_id, value.player2_id]);
  res.status(201).json(rows[0]);
});

export default router;
