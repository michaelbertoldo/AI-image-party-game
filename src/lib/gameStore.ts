import { create } from 'zustand';

// Game state types
export type GameStatus = 'waiting' | 'playing' | 'voting' | 'results' | 'completed';

export interface Player {
  id: string;
  name: string;
  isHost: boolean;
  isReady: boolean;
  score: number;
  avatar?: string;
}

export interface Prompt {
  id: string;
  text: string;
  round: number;
  promptIndex: number;
}

export interface ImageSubmission {
  id: string;
  playerId: string;
  promptId: string;
  promptText: string;
  imageUrl: string;
  round: number;
  promptIndex: number;
}

export interface Vote {
  playerId: string;
  submissionId: string;
  promptId: string;
}

export interface RoundResult {
  promptId: string;
  winningSubmissionId: string;
  isUnanimous: boolean;
  pointsAwarded: number;
  votes: Record<string, number>; // submissionId -> vote count
}

export interface GameState {
  // Game session info
  gameId: string | null;
  joinCode: string | null;
  status: GameStatus;
  currentRound: number;
  currentPromptIndex: number;
  maxRounds: number;
  maxPromptsPerRound: number;
  maxPlayers: number;
  
  // Players
  playerId: string | null;
  playerName: string | null;
  players: Record<string, Player>;
  
  // Game content
  prompts: Record<string, Prompt>;
  currentPrompt: Prompt | null;
  submissions: Record<string, ImageSubmission>;
  votes: Record<string, Vote>;
  results: Record<string, RoundResult>;
  
  // UI state
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setGameSession: (gameId: string, joinCode: string) => void;
  setPlayerId: (playerId: string, playerName: string) => void;
  setGameStatus: (status: GameStatus) => void;
  setCurrentRound: (round: number) => void;
  setCurrentPromptIndex: (index: number) => void;
  setCurrentPrompt: (prompt: Prompt) => void;
  addPlayer: (player: Player) => void;
  removePlayer: (playerId: string) => void;
  updatePlayerStatus: (playerId: string, isReady: boolean) => void;
  updatePlayerScore: (playerId: string, score: number) => void;
  addPrompt: (prompt: Prompt) => void;
  addSubmission: (submission: ImageSubmission) => void;
  addVote: (vote: Vote) => void;
  addResult: (result: RoundResult) => void;
  resetGame: () => void;
  
  // Game logic
  isPlayerHost: () => boolean;
  canStartGame: () => boolean;
  getPromptSubmissions: (promptId: string) => ImageSubmission[];
  getPlayerSubmission: (playerId: string, promptId: string) => ImageSubmission | null;
  hasPlayerVoted: (playerId: string, promptId: string) => boolean;
  getVotableSubmissions: (promptId: string, playerId: string) => ImageSubmission[];
  calculateRoundResults: (promptId: string) => RoundResult;
  isRoundComplete: () => boolean;
  isGameComplete: () => boolean;
  getWinner: () => Player | null;
}

// Sample prompts for the game
const SAMPLE_PROMPTS = [
  "A superhero with an unusual power",
  "An animal doing a human job",
  "A famous person in a ridiculous situation",
  "The weirdest food combination ever",
  "A day in the life of a household object",
  "If aliens visited a mundane place on Earth",
  "A monster that is afraid of something silly",
  "The world's most impractical vehicle",
  "A pet with a secret double life",
  "The strangest sport never invented",
  "A robot trying to understand human emotions",
  "The most over-the-top wedding ever",
  "A time traveler experiencing modern technology",
  "The world's worst superhero team",
  "An unlikely animal friendship",
  "The most ridiculous fashion trend of the future",
  "A day at the beach gone hilariously wrong",
  "If plants could talk and move",
  "The world's most unusual restaurant",
  "A fairy tale character in the modern world"
];

// Create the game store
export const useGameStore = create<GameState>((set, get) => ({
  // Initial state
  gameId: null,
  joinCode: null,
  status: 'waiting',
  currentRound: 1,
  currentPromptIndex: 0,
  maxRounds: 3,
  maxPromptsPerRound: 4,
  maxPlayers: 8,
  
  playerId: null,
  playerName: null,
  players: {},
  
  prompts: {},
  currentPrompt: null,
  submissions: {},
  votes: {},
  results: {},
  
  isLoading: false,
  error: null,
  
  // Actions
  setGameSession: (gameId, joinCode) => set({ gameId, joinCode }),
  
  setPlayerId: (playerId, playerName) => set({ playerId, playerName }),
  
  setGameStatus: (status) => set({ status }),
  
  setCurrentRound: (round) => set({ currentRound: round }),
  
  setCurrentPromptIndex: (index) => set({ currentPromptIndex: index }),
  
  setCurrentPrompt: (prompt) => set({ currentPrompt: prompt }),
  
  addPlayer: (player) => set((state) => ({
    players: {
      ...state.players,
      [player.id]: player
    }
  })),
  
  removePlayer: (playerId) => set((state) => {
    const newPlayers = { ...state.players };
    delete newPlayers[playerId];
    return { players: newPlayers };
  }),
  
  updatePlayerStatus: (playerId, isReady) => set((state) => ({
    players: {
      ...state.players,
      [playerId]: {
        ...state.players[playerId],
        isReady
      }
    }
  })),
  
  updatePlayerScore: (playerId, score) => set((state) => ({
    players: {
      ...state.players,
      [playerId]: {
        ...state.players[playerId],
        score: state.players[playerId].score + score
      }
    }
  })),
  
  addPrompt: (prompt) => set((state) => ({
    prompts: {
      ...state.prompts,
      [prompt.id]: prompt
    }
  })),
  
  addSubmission: (submission) => set((state) => ({
    submissions: {
      ...state.submissions,
      [submission.id]: submission
    }
  })),
  
  addVote: (vote) => set((state) => ({
    votes: {
      ...state.votes,
      [`${vote.playerId}-${vote.promptId}`]: vote
    }
  })),
  
  addResult: (result) => set((state) => ({
    results: {
      ...state.results,
      [result.promptId]: result
    }
  })),
  
  resetGame: () => set({
    status: 'waiting',
    currentRound: 1,
    currentPromptIndex: 0,
    currentPrompt: null,
    submissions: {},
    votes: {},
    results: {}
  }),
  
  // Game logic
  isPlayerHost: () => {
    const { playerId, players } = get();
    return playerId ? players[playerId]?.isHost || false : false;
  },
  
  canStartGame: () => {
    const { players } = get();
    const playerList = Object.values(players);
    return playerList.length >= 2 && playerList.every(p => p.isReady);
  },
  
  getPromptSubmissions: (promptId) => {
    const { submissions } = get();
    return Object.values(submissions).filter(s => s.promptId === promptId);
  },
  
  getPlayerSubmission: (playerId, promptId) => {
    const { submissions } = get();
    return Object.values(submissions).find(
      s => s.playerId === playerId && s.promptId === promptId
    ) || null;
  },
  
  hasPlayerVoted: (playerId, promptId) => {
    const { votes } = get();
    return !!votes[`${playerId}-${promptId}`];
  },
  
  getVotableSubmissions: (promptId, playerId) => {
    const { submissions } = get();
    // Players can't vote for their own submissions
    return Object.values(submissions)
      .filter(s => s.promptId === promptId && s.playerId !== playerId);
  },
  
  calculateRoundResults: (promptId) => {
    const { votes, submissions } = get();
    
    // Count votes for each submission
    const voteCounts: Record<string, number> = {};
    
    // Initialize vote counts for all submissions
    Object.values(submissions)
      .filter(s => s.promptId === promptId)
      .forEach(s => {
        voteCounts[s.id] = 0;
      });
    
    // Count votes
    Object.values(votes)
      .filter(v => v.promptId === promptId)
      .forEach(vote => {
        voteCounts[vote.submissionId] = (voteCounts[vote.submissionId] || 0) + 1;
      });
    
    // Find submission with most votes
    let winningSubmissionId = '';
    let maxVotes = 0;
    
    Object.entries(voteCounts).forEach(([submissionId, count]) => {
      if (count > maxVotes) {
        maxVotes = count;
        winningSubmissionId = submissionId;
      }
    });
    
    // Check if unanimous (all voters voted for the same submission)
    const totalVoters = Object.values(votes).filter(v => v.promptId === promptId).length;
    const isUnanimous = maxVotes === totalVoters && totalVoters > 0;
    
    // Calculate points (100 per vote, 1000 if unanimous)
    const pointsAwarded = isUnanimous ? 1000 : maxVotes * 100;
    
    return {
      promptId,
      winningSubmissionId,
      isUnanimous,
      pointsAwarded,
      votes: voteCounts
    };
  },
  
  isRoundComplete: () => {
    const { currentPromptIndex, maxPromptsPerRound } = get();
    return currentPromptIndex >= maxPromptsPerRound;
  },
  
  isGameComplete: () => {
    const { currentRound, maxRounds } = get();
    return currentRound > maxRounds;
  },
  
  getWinner: () => {
    const { players } = get();
    const playerList = Object.values(players);
    
    if (playerList.length === 0) return null;
    
    return playerList.reduce((winner, player) => {
      return player.score > winner.score ? player : winner;
    }, playerList[0]);
  }
}));

// Helper function to generate game prompts
export function generateGamePrompts(rounds = 3, promptsPerRound = 4): Prompt[] {
  // Shuffle the sample prompts
  const shuffled = [...SAMPLE_PROMPTS].sort(() => 0.5 - Math.random());
  const prompts: Prompt[] = [];
  
  // Generate prompts for each round
  for (let round = 1; round <= rounds; round++) {
    for (let promptIndex = 0; promptIndex < promptsPerRound; promptIndex++) {
      const index = (round - 1) * promptsPerRound + promptIndex;
      const promptId = `${round}-${promptIndex}`;
      
      prompts.push({
        id: promptId,
        text: shuffled[index % shuffled.length],
        round,
        promptIndex
      });
    }
  }
  
  return prompts;
}
