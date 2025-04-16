-- Initial database schema for AI Party Game

-- Game Sessions table
CREATE TABLE IF NOT EXISTS game_sessions (
  id TEXT PRIMARY KEY,
  host_id TEXT NOT NULL,
  status TEXT CHECK(status IN ('waiting', 'playing', 'completed')) NOT NULL,
  current_round INTEGER DEFAULT 1,
  current_prompt_index INTEGER DEFAULT 0,
  max_players INTEGER DEFAULT 8,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  join_code TEXT UNIQUE NOT NULL
);

-- Players table
CREATE TABLE IF NOT EXISTS players (
  id TEXT NOT NULL,
  game_id TEXT NOT NULL,
  name TEXT NOT NULL,
  avatar TEXT,
  score INTEGER DEFAULT 0,
  is_host BOOLEAN DEFAULT FALSE,
  is_connected BOOLEAN DEFAULT TRUE,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id, game_id),
  FOREIGN KEY (game_id) REFERENCES game_sessions(id) ON DELETE CASCADE
);

-- Game Prompts table
CREATE TABLE IF NOT EXISTS prompts (
  id TEXT PRIMARY KEY,
  game_id TEXT NOT NULL,
  round INTEGER NOT NULL,
  prompt_index INTEGER NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (game_id) REFERENCES game_sessions(id) ON DELETE CASCADE,
  UNIQUE(game_id, round, prompt_index)
);

-- Image Submissions table
CREATE TABLE IF NOT EXISTS image_submissions (
  id TEXT PRIMARY KEY,
  game_id TEXT NOT NULL,
  prompt_id TEXT NOT NULL,
  player_id TEXT NOT NULL,
  prompt_text TEXT NOT NULL,
  image_url TEXT,
  fallback_url TEXT,
  round INTEGER NOT NULL,
  prompt_index INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (game_id) REFERENCES game_sessions(id) ON DELETE CASCADE,
  FOREIGN KEY (prompt_id) REFERENCES prompts(id) ON DELETE CASCADE,
  FOREIGN KEY (player_id, game_id) REFERENCES players(id, game_id) ON DELETE CASCADE
);

-- Votes table
CREATE TABLE IF NOT EXISTS votes (
  id TEXT PRIMARY KEY,
  game_id TEXT NOT NULL,
  prompt_id TEXT NOT NULL,
  voter_id TEXT NOT NULL,
  submission_id TEXT NOT NULL,
  round INTEGER NOT NULL,
  prompt_index INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (game_id) REFERENCES game_sessions(id) ON DELETE CASCADE,
  FOREIGN KEY (prompt_id) REFERENCES prompts(id) ON DELETE CASCADE,
  FOREIGN KEY (voter_id, game_id) REFERENCES players(id, game_id) ON DELETE CASCADE,
  FOREIGN KEY (submission_id) REFERENCES image_submissions(id) ON DELETE CASCADE,
  UNIQUE(voter_id, prompt_id)
);

-- Round Results table
CREATE TABLE IF NOT EXISTS round_results (
  id TEXT PRIMARY KEY,
  game_id TEXT NOT NULL,
  round INTEGER NOT NULL,
  prompt_index INTEGER NOT NULL,
  winning_submission_id TEXT NOT NULL,
  is_unanimous BOOLEAN DEFAULT FALSE,
  points_awarded INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (game_id) REFERENCES game_sessions(id) ON DELETE CASCADE,
  FOREIGN KEY (winning_submission_id) REFERENCES image_submissions(id) ON DELETE CASCADE,
  UNIQUE(game_id, round, prompt_index)
);

-- Game History table
CREATE TABLE IF NOT EXISTS game_history (
  id TEXT PRIMARY KEY,
  game_id TEXT UNIQUE NOT NULL,
  winner_id TEXT NOT NULL,
  round_count INTEGER NOT NULL,
  started_at TIMESTAMP NOT NULL,
  ended_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (game_id) REFERENCES game_sessions(id) ON DELETE CASCADE
);

-- Player History table (for storing final scores in completed games)
CREATE TABLE IF NOT EXISTS player_history (
  game_history_id TEXT NOT NULL,
  player_id TEXT NOT NULL,
  name TEXT NOT NULL,
  score INTEGER NOT NULL,
  rank INTEGER NOT NULL,
  PRIMARY KEY (game_history_id, player_id),
  FOREIGN KEY (game_history_id) REFERENCES game_history(id) ON DELETE CASCADE
);

-- Sample prompts for the game
CREATE TABLE IF NOT EXISTS prompt_templates (
  id TEXT PRIMARY KEY,
  text TEXT NOT NULL,
  category TEXT DEFAULT 'general'
);

-- Insert some sample prompts
INSERT INTO prompt_templates (id, text, category) VALUES
('prompt1', 'A superhero with an unusual power', 'character'),
('prompt2', 'An animal doing a human job', 'scenario'),
('prompt3', 'A famous person in a ridiculous situation', 'celebrity'),
('prompt4', 'The weirdest food combination ever', 'food'),
('prompt5', 'A day in the life of a household object', 'object'),
('prompt6', 'If aliens visited a mundane place on Earth', 'scenario'),
('prompt7', 'A monster that is afraid of something silly', 'character'),
('prompt8', 'The world's most impractical vehicle', 'object'),
('prompt9', 'A pet with a secret double life', 'character'),
('prompt10', 'The strangest sport never invented', 'activity'),
('prompt11', 'A robot trying to understand human emotions', 'character'),
('prompt12', 'The most over-the-top wedding ever', 'event');
