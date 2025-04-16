// Database schema for AI Party Game

// Game Sessions
type GameSession = {
  id: string;              // Unique identifier for the game session
  hostId: string;          // User ID of the host who created the game
  status: 'waiting' | 'playing' | 'completed'; // Current game status
  currentRound: number;    // Current round number (1-3)
  currentPromptIndex: number; // Current prompt index within the round
  maxPlayers: number;      // Maximum number of players (default: 8)
  createdAt: Timestamp;    // When the game was created
  updatedAt: Timestamp;    // Last update timestamp
  joinCode: string;        // Unique code for players to join the game
}

// Players in a Game
type Player = {
  id: string;              // User ID from Clerk
  gameId: string;          // Reference to the game session
  name: string;            // Display name
  avatar: string;          // Avatar URL
  score: number;           // Current score
  isHost: boolean;         // Whether this player is the host
  isConnected: boolean;    // Whether player is currently connected
  joinedAt: Timestamp;     // When player joined the game
}

// Game Prompts
type Prompt = {
  id: string;              // Unique identifier for the prompt
  gameId: string;          // Reference to the game session
  round: number;           // Round number (1-3)
  promptIndex: number;     // Prompt index within the round (0-3)
  text: string;            // The actual prompt text
  createdAt: Timestamp;    // When the prompt was created
}

// Image Submissions
type ImageSubmission = {
  id: string;              // Unique identifier for the submission
  gameId: string;          // Reference to the game session
  promptId: string;        // Reference to the prompt
  playerId: string;        // Player who submitted
  promptText: string;      // Text prompt for AI image generation
  imageUrl: string;        // URL of the generated image
  fallbackUrl: string;     // Fallback GIF/sticker URL if AI generation fails
  round: number;           // Round number
  promptIndex: number;     // Prompt index within the round
  createdAt: Timestamp;    // When the submission was created
}

// Votes
type Vote = {
  id: string;              // Unique identifier for the vote
  gameId: string;          // Reference to the game session
  promptId: string;        // Reference to the prompt
  voterId: string;         // Player who voted
  submissionId: string;    // Reference to the image submission being voted for
  round: number;           // Round number
  promptIndex: number;     // Prompt index within the round
  createdAt: Timestamp;    // When the vote was cast
}

// Round Results
type RoundResult = {
  id: string;              // Unique identifier for the result
  gameId: string;          // Reference to the game session
  round: number;           // Round number
  promptIndex: number;     // Prompt index within the round
  winningSubmissionId: string; // Reference to the winning submission
  isUnanimous: boolean;    // Whether the vote was unanimous
  pointsAwarded: number;   // Points awarded to the winner
  createdAt: Timestamp;    // When the result was created
}

// Game History
type GameHistory = {
  id: string;              // Unique identifier for the history record
  gameId: string;          // Reference to the game session
  players: {               // Map of player IDs to their final scores
    [playerId: string]: {
      name: string;
      score: number;
      rank: number;
    }
  };
  winnerId: string;        // Player ID of the winner
  roundCount: number;      // Number of rounds played
  startedAt: Timestamp;    // When the game started
  endedAt: Timestamp;      // When the game ended
}
