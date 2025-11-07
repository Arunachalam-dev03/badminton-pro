import express from 'express'; import db from '../config/db.js'; import upload from '../middleware/upload.js'; import { playerSchema } from '../utils/validators.js'; import { auth, isAdmin } from '../middleware/auth.js';
const router = express.Router();

router.get('/', async (req,res)=>{
  const { rows } = await db.query('SELECT id,name,country,photo_url,elo,wins,losses FROM players ORDER BY elo DESC, wins DESC');
  res.json(rows);
});

router.post('/register', upload.single('photo'), async (req,res)=>{
  const { value, error } = playerSchema.validate(req.body); if (error) return res.status(400).json({message:error.message});
  const photo = req.file ? `/uploads/${req.file.filename}` : null;
  const { rows } = await db.query('INSERT INTO players (name,country,email,phone,hand,photo_url) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *', [value.name, value.country || null, value.email || null, value.phone || null, value.hand || null, photo]);
  res.status(201).json(rows[0]);
});

export default router;
