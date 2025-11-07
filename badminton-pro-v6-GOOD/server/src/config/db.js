import pkg from 'pg'; const { Pool } = pkg;
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'badminton',
  password: process.env.DB_PASS || 'badminton123',
  database: process.env.DB_NAME || 'badminton_world'
});
export default { query: (t,p)=>pool.query(t,p), pool };
