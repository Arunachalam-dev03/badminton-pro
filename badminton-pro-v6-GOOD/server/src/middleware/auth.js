import jwt from 'jsonwebtoken';
export function auth(required=true){
  return (req,res,next)=>{
    const h = req.headers.authorization || '';
    const t = h.startsWith('Bearer ') ? h.slice(7) : null;
    if (!t) return required ? res.status(401).json({message:'No token'}) : next();
    try{ req.user = jwt.verify(t, process.env.JWT_SECRET || 'dev'); next(); }
    catch(e){ return res.status(401).json({message:'Invalid token'}) }
  }
}
export function isAdmin(req,res,next){ if (req.user?.role==='admin') return next(); return res.status(403).json({message:'Admin only'}) }
