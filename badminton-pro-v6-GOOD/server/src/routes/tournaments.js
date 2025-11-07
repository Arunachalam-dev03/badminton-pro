import express from 'express'; import db from '../config/db.js'; import { auth, isAdmin } from '../middleware/auth.js'; import PDFDocument from 'pdfkit';
const router = express.Router();

router.get('/', async (req,res)=>{ const { rows } = await db.query('SELECT * FROM tournaments ORDER BY start_date DESC NULLS LAST, created_at DESC'); res.json(rows); });

router.post('/', auth(), isAdmin, async (req,res)=>{
  const { title, location, start_date, end_date, format, level } = req.body;
  const { rows } = await db.query('INSERT INTO tournaments (title,location,start_date,end_date,format,level) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',[title, location||null, start_date||null, end_date||null, format||'elimination', level||'open']);
  res.status(201).json(rows[0]);
});

router.get('/:id/bracket.pdf', async (req,res)=>{
  const tid = req.params.id;
  const { rows: t } = await db.query('SELECT * FROM tournaments WHERE id=$1',[tid]);
  const { rows: ms } = await db.query(`
    SELECT m.*, COALESCE(p1.name,t1.name) as A, COALESCE(p2.name,t2.name) as B
    FROM matches m
    LEFT JOIN players p1 ON p1.id=m.player1_id
    LEFT JOIN players p2 ON p2.id=m.player2_id
    LEFT JOIN teams t1 ON t1.id=m.team1_id
    LEFT JOIN teams t2 ON t2.id=m.team2_id
    WHERE m.tournament_id=$1 ORDER BY round ASC, created_at ASC
  `,[tid]);
  res.setHeader('Content-Type','application/pdf');
  const doc=new PDFDocument({margin:40}); doc.pipe(res);
  doc.fontSize(18).text(`Tournament: ${t[0]?.title || ''}`,{align:'center'}); doc.moveDown();
  let y=120, r=1;
  for(const m of ms){ if(m.round!==r){ r=m.round; y+=30; doc.fontSize(14).text(`Round ${r}`,50,y); y+=20; } doc.fontSize(12).text(`${m.A || 'BYE'} vs ${m.B || 'BYE'}   [${m.current_score || '-'}]`,50,y); y+=18; }
  doc.end();
});

export default router;
