import redis from './src/config/redis.js'; import db from './src/config/db.js'; import { eloDelta } from './src/utils/elo.js';
console.log('Worker listening for match_completed');
await redis.subscribe('match_completed', async (msg)=>{
  const m = JSON.parse(msg);
  try{
    if (m.type === 'D' && (m.winner_team_id)){
      const { rows: t1r } = await db.query('SELECT id, elo FROM teams WHERE id=$1',[m.team1_id]);
      const { rows: t2r } = await db.query('SELECT id, elo FROM teams WHERE id=$1',[m.team2_id]);
      if (!t1r.length || !t2r.length) return;
      const t1=t1r[0], t2=t2r[0], t1win = m.winner_team_id===t1.id;
      const d = eloDelta(t1.elo, t2.elo, t1win?1:0);
      await db.query('UPDATE teams SET elo=elo+$1, wins=wins+$2, losses=losses+$3 WHERE id=$4',[d, t1win?1:0, t1win?0:1, t1.id]);
      await db.query('UPDATE teams SET elo=elo-$1, wins=wins+$2, losses=losses+$3 WHERE id=$4',[d, t1win?0:1, t1win?1:0, t2.id]);
    } else if (m.winner_player_id){
      const { rows: p1r } = await db.query('SELECT id, elo FROM players WHERE id=$1',[m.player1_id]);
      const { rows: p2r } = await db.query('SELECT id, elo FROM players WHERE id=$1',[m.player2_id]);
      if (!p1r.length || !p2r.length) return;
      const p1=p1r[0], p2=p2r[0], p1win = m.winner_player_id===p1.id;
      const d = eloDelta(p1.elo, p2.elo, p1win?1:0);
      await db.query('UPDATE players SET elo=elo+$1, wins=wins+$2, losses=losses+$3 WHERE id=$4',[d, p1win?1:0, p1win?0:1, p1.id]);
      await db.query('UPDATE players SET elo=elo-$1, wins=wins+$2, losses=losses+$3 WHERE id=$4',[d, p1win?0:1, p1win?1:0, p2.id]);
    }
  }catch(e){ console.error('worker error', e.message); }
});
