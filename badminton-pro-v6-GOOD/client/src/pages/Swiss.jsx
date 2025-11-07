import React, { useEffect, useState } from 'react'; import api from '../api';
export default function Swiss(){ const [players,setPlayers]=useState([]); const [pairs,setPairs]=useState([]);
  useEffect(()=>{ (async()=>{ const {data}=await api.get('/players'); setPlayers(data) })() },[]);
  const generate=async()=>{ const sorted=[...players].sort((a,b)=>b.elo-a.elo); const local=[]; while(sorted.length>1){ const a=sorted.shift(); let idx=0, diff=1e9; for(let i=0;i<sorted.length;i++){ const d=Math.abs(sorted[i].elo-a.elo); if(d<diff){diff=d; idx=i;} } const b=sorted.splice(idx,1)[0]; local.push([a,b]); } if(sorted.length) local.push([sorted[0], null]); setPairs(local); };
  return (<section className="card"><h3 className="font-semibold mb-2">Swiss Groups (demo pairing)</h3><button className="btn mb-2" onClick={generate}>Generate</button><div className="space-y-2">{pairs.map((p,i)=>(<div key={i}>{p[0]?.name} vs {p[1]?.name || 'BYE'}</div>))}</div></section>); }
