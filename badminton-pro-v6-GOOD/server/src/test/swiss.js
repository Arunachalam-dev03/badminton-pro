// very simple Swiss pairing generator: pair closest ELOs not yet paired this round
export function swissPair(players){
  const ps = players.slice().sort((a,b)=>b.elo - a.elo);
  const pairs = [];
  while(ps.length>1){
    const a = ps.shift();
    // find closest ELO to a
    let idx = 0, diff = 1e9;
    for(let i=0;i<ps.length;i++){ const d=Math.abs(ps[i].elo - a.elo); if(d<diff){ diff=d; idx=i; } }
    const b = ps.splice(idx,1)[0];
    pairs.push([a.id, b.id]);
  }
  if (ps.length) pairs.push([ps[0].id, null]); // bye
  return pairs;
}
