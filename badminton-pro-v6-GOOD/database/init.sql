CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- users/admins
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(120) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT NOW()
);

-- players & teams (for doubles)
CREATE TABLE IF NOT EXISTS players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(120) NOT NULL,
  country VARCHAR(80),
  email VARCHAR(255),
  phone VARCHAR(50),
  photo_url VARCHAR(500),
  hand VARCHAR(10),
  elo INT DEFAULT 1200,
  wins INT DEFAULT 0,
  losses INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(200) NOT NULL,
  player1_id UUID REFERENCES players(id) ON DELETE SET NULL,
  player2_id UUID REFERENCES players(id) ON DELETE SET NULL,
  elo INT DEFAULT 1200,
  wins INT DEFAULT 0,
  losses INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- venues/courts
CREATE TABLE IF NOT EXISTS courts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) NOT NULL,
  location VARCHAR(120)
);

-- tournaments & swiss groups
CREATE TABLE IF NOT EXISTS tournaments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  location VARCHAR(150),
  start_date DATE,
  end_date DATE,
  format VARCHAR(30) DEFAULT 'elimination', -- elimination | swiss
  level VARCHAR(30) DEFAULT 'open', -- open, junior, masters, etc.
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS swiss_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
  round INT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- matches (singles/doubles + court assignment)
CREATE TABLE IF NOT EXISTS matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tournament_id UUID REFERENCES tournaments(id) ON DELETE SET NULL,
  court_id UUID REFERENCES courts(id) ON DELETE SET NULL,
  round INT DEFAULT 1,
  type VARCHAR(10) DEFAULT 'S', -- S=singles, D=doubles
  player1_id UUID REFERENCES players(id) ON DELETE SET NULL,
  player2_id UUID REFERENCES players(id) ON DELETE SET NULL,
  team1_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  team2_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  scheduled_at TIMESTAMP,
  current_score VARCHAR(50),
  status VARCHAR(20) DEFAULT 'scheduled',
  winner_player_id UUID REFERENCES players(id),
  winner_team_id UUID REFERENCES teams(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- rally/timeline events
CREATE TABLE IF NOT EXISTS match_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  ts TIMESTAMP DEFAULT NOW(),
  event_type VARCHAR(30), -- rally, fault, service, challenge, interval
  detail JSONB
);
