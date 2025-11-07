import React, { useEffect, useState } from 'react'; import api from '../api'; import { socket } from '../socket';
export default function Umpire(){ const [matches,setMatches]=useState([]); const [sel,setSel]=useState(''), [score,setScore]=useState('');
  const load=async()=>{ const {data}=await api.get('/matches'); setMatches(data); };
  useEffect(()=>{ load() },[]);
  const match = matches.find(m=>m.id===sel);
  const update = async (payload)=>{ await api.put(`/matches/${sel}/score`, payload); };
  const pointA=()=> setScore(s=> (s? s+', ': '') + 'A'); const pointB=()=> setScore(s=> (s? s+', ': '') + 'B');
  const sendLive=()=> update({ score, status:'in_progress' });
  const finalize=(winner)=> update({ score, status:'completed', winner_player_id: winner==='A' ? match.player1_id : match.player2_id, winner_team_id: null });
  return (<section className="card"><h3 className="font-semibold mb-2">Umpire Console</h3>
    <select className="input mb-3" value={sel} onChange={e=>setSel(e.target.value)}><option value="">Select match...</option>{matches.map(m=>(<option key={m.id} value={m.id}>{m.player1_name} vs {m.player2_name}</option>))}</select>
    {match && (<div className="grid gap-3 md:grid-cols-2">
      <div className="card"><div className="text-sm text-[#9fb0cc]">Court {match.court_name || '?'}</div><div className="text-2xl">{match.player1_name} vs {match.player2_name}</div><div className="text-lg mt-2">Score: {score || match.current_score || '-'}</div></div>
      <div className="card space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <button className="btn" onClick={pointA}>+1 {match.player1_name}</button>
          <button className="btn" onClick={pointB}>+1 {match.player2_name}</button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button className="btn" onClick={sendLive}>Send Live</button>
          <button className="btn" onClick={()=>setScore('')}>Clear</button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button className="btn" onClick={()=>finalize('A')}>Finalize: {match.player1_name}</button>
          <button className="btn" onClick={()=>finalize('B')}>Finalize: {match.player2_name}</button>
        </div>
      </div>
    </div>)}
  </section>); }
