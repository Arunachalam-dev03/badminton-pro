import React, { useEffect, useState } from 'react'; import api from '../api';
export default function Scheduler(){ const [courts,setCourts]=useState([]); const [matches,setMatches]=useState([]);
  const [court,setCourt]=useState(''); const [round,setRound]=useState(1);
  useEffect(()=>{ (async()=>{ const c=await api.get('/courts'); const m=await api.get('/matches'); setCourts(c.data); setMatches(m.data); })() },[]);
  const createCourt=async()=>{ const name=prompt('Court name'); if(!name) return; await api.post('/courts',{name}); const c=await api.get('/courts'); setCourts(c.data); };
  const createMatch=async()=>{ const a=prompt('Player/Team A ID'); const b=prompt('Player/Team B ID'); await api.post('/matches',{ court_id:court||null, round, type:'S', player1_id:a, player2_id:b }); const m=await api.get('/matches'); setMatches(m.data); };
  return (<section className="card"><h3 className="font-semibold mb-2">Scheduler</h3>
    <div className="grid md:grid-cols-3 gap-3">
      <div className="card"><h4 className="font-semibold mb-2">Courts</h4><button className="btn mb-2" onClick={createCourt}>Add Court</button>{courts.map(c=>(<div key={c.id} className="flex items-center gap-2"><input type="radio" name="court" onChange={()=>setCourt(c.id)}/><div>{c.name}</div></div>))}</div>
      <div className="card"><h4 className="font-semibold mb-2">Create Match</h4><div className="space-y-2"><input className="input" placeholder="Round" value={round} onChange={e=>setRound(e.target.value)}/><button className="btn" onClick={createMatch}>Create</button></div></div>
      <div className="card"><h4 className="font-semibold mb-2">Upcoming</h4>{matches.filter(m=>m.status==='scheduled').map(m=>(<div key={m.id} className="border-t border-[#20304d] py-2">{m.player1_name} vs {m.player2_name} • {m.court_name || '?'}</div>))}</div>
    </div>
  </section>); }
