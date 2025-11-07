import express from 'express'; import bcrypt from 'bcryptjs'; import jwt from 'jsonwebtoken'; import db from '../config/db.js';
const router = express.Router();

export async function seedAdmin(){
  const email = process.env.SEED_ADMIN_EMAIL || 'admin@example.com', pass = process.env.SEED_ADMIN_PASSWORD || 'admin123';
  const { rowCount } = await db.query('SELECT 1 FROM users WHERE email=$1',[email]);
  if (!rowCount){ const hash = await bcrypt.hash(pass,10); await db.query('INSERT INTO users (name,email,password_hash,role) VALUES ($1,$2,$3,$4)', ['Admin',email,hash,'admin']); console.log('Seeded admin', email) }
}

router.post('/login', async (req,res)=>{
  const { email, password } = req.body;
  const { rows } = await db.query('SELECT * FROM users WHERE email=$1',[email]);
  if (!rows.length) return res.status(401).json({message:'Invalid credentials'});
  const ok = await bcrypt.compare(password, rows[0].password_hash);
  if (!ok) return res.status(401).json({message:'Invalid credentials'});
  const user = { id: rows[0].id, name: rows[0].name, email: rows[0].email, role: rows[0].role };
  const token = jwt.sign(user, process.env.JWT_SECRET || 'dev', { expiresIn:'7d' });
  res.json({ user, token });
});

export default router;
