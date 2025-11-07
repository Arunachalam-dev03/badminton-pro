import React, { useEffect, useState } from 'react'; import api from '../api';
export default function Admin(){ const [players,setPlayers]=useState([]); const [matches,setMatches]=useState([]); const [courts,setCourts]=useState([]); const [score,setScore]=useState('');
  const reload=async()=>{ const [p,m,c]=await Promise.all([api.get('/players'), api.get('/matches'), api.get('/courts')]); setPlayers(p.data); setMatches(m.data); setCourts(c.data); };
  useEffect(()=>{ reload() },[]);
  const setMatchScore=async(id, payload)=>{ await api.put(`/matches/${id}/score`, payload); setScore(''); reload(); };
  return (<div className="space-y-4">
    <section className="card"><h3 className="font-semibold mb-2">Courts</h3><div className="grid md:grid-cols-4 gap-2">{courts.map(c=>(<div key={c.id} className="card">{c.name} • {c.location || ''}</div>))}</div></section>
    <section className="card"><h3 className="font-semibold mb-2">Matches</h3>{matches.map(m=>(<div key={m.id} className="border-t border-[#20304d] py-2">
      <div className="font-semibold">{m.player1_name} vs {m.player2_name} <span className="text-sm text-[#9fb0cc]">• Court {m.court_name || '?'}</span></div>
      <div className="text-sm text-[#9fb0cc]">Current: {m.current_score || '-'}</div>
      <div className="grid md:grid-cols-4 gap-2 mt-2 items-center">
        <input className="input" placeholder="Score e.g., 21-18, 12-21, 21-19" value={score} onChange={e=>setScore(e.target.value)}/>
        <button className="btn" onClick={()=>setMatchScore(m.id,{ score, status:'in_progress' })}>Update Live</button>
        <button className="btn" onClick={()=>setMatchScore(m.id,{ score, status:'completed', winner_player_id:m.player1_id })}>Set {m.player1_name} Win</button>
        <button className="btn" onClick={()=>setMatchScore(m.id,{ score, status:'completed', winner_player_id:m.player2_id })}>Set {m.player2_name} Win</button>
      </div>
    </div>))}</section>
  </div>); }
