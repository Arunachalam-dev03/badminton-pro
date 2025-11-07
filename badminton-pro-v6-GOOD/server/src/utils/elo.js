export function eloDelta(ra, rb, sa){
  const qa = Math.pow(10, ra/400), qb = Math.pow(10, rb/400);
  const ea = qa/(qa+qb); const k = 32;
  return Math.round(k*(sa - ea));
}
