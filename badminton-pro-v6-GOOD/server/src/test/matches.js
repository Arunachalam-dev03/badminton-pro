import express from 'express'; import db from '../config/db.js'; import { auth, isAdmin } from '../middleware/auth.js'; import { matchScoreSchema } from '../utils/validators.js'; import redis from '../config/redis.js';
const router = express.Router();

router.get('/', async (req,res)=>{
  const { rows } = await db.query(`
    SELECT m.*, 
      COALESCE(p1.name,t1.name) as player1_name,
      COALESCE(p2.name,t2.name) as player2_name,
      t.title as tournament_title, c.name as court_name
    FROM matches m
    LEFT JOIN players p1 ON p1.id = m.player1_id
    LEFT JOIN players p2 ON p2.id = m.player2_id
    LEFT JOIN teams t1 ON t1.id = m.team1_id
    LEFT JOIN teams t2 ON t2.id = m.team2_id
    LEFT JOIN tournaments t ON t.id = m.tournament_id
    LEFT JOIN courts c ON c.id = m.court_id
    ORDER BY m.created_at DESC
  `);
  res.json(rows);
});

router.post('/', auth(), isAdmin, async (req,res)=>{
  const { tournament_id, court_id, round, type, player1_id, player2_id, team1_id, team2_id, scheduled_at } = req.body;
  const { rows } = await db.query(
    'INSERT INTO matches (tournament_id, court_id, round, type, player1_id, player2_id, team1_id, team2_id, scheduled_at, status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *',
    [tournament_id || null, court_id || null, round || 1, type || 'S', player1_id || null, player2_id || null, team1_id || null, team2_id || null, scheduled_at || new Date(), 'scheduled']
  );
  res.status(201).json(rows[0]);
});

router.put('/:id/score', auth(), isAdmin, async (req,res)=>{
  const { value, error } = matchScoreSchema.validate(req.body); if(error) return res.status(400).json({message:error.message});
  const id = req.params.id;
  const { rows } = await db.query('UPDATE matches SET current_score=$1, status=$2, winner_player_id=$3, winner_team_id=$4 WHERE id=$5 RETURNING *', [value.score, value.status, value.winner_player_id, value.winner_team_id, id]);
  const updated = rows[0];
  req.app.locals.io.to(`match:${id}`).emit('score', updated);
  req.app.locals.io.to('matches').emit('score', updated);
  if (value.status==='completed' && (value.winner_player_id || value.winner_team_id)) await redis.publish('match_completed', JSON.stringify(updated));
  res.json(updated);
});

// timeline events
router.get('/:id/events', async (req,res)=>{
  const { rows } = await db.query('SELECT * FROM match_events WHERE match_id=$1 ORDER BY ts ASC',[req.params.id]); res.json(rows);
});
router.post('/:id/events', auth(), async (req,res)=>{
  const { event_type, detail } = req.body; const { rows } = await db.query('INSERT INTO match_events (match_id,event_type,detail) VALUES ($1,$2,$3) RETURNING *',[req.params.id, event_type, detail || {} ]); req.app.locals.io.to(`match:${req.params.id}`).emit('event', rows[0]); res.status(201).json(rows[0]);
});

export default router;
