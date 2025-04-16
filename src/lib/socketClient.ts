"use client";

import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { create } from 'zustand';

// Game state interfaces
interface Player {
  id: string;
  name: string;
  socketId: string;
  isHost: boolean;
  isReady: boolean;
  score: number;
}

interface GameSession {
  id: string;
  joinCode: string;
  status: 'waiting' | 'playing' | 'completed';
  players: Record<string, Player>;
  hostId: string;
  currentRound: number;
  currentPromptIndex: number;
  maxPlayers: number;
}

interface Prompt {
  id: string;
  text: string;
}

interface ImageSubmission {
  id: string;
  playerId: string;
  promptId: string;
  promptText: string;
  imageUrl: string;
  round: number;
  promptIndex: number;
}

interface VotingResult {
  promptId: string;
  winningSubmissionId: string;
  isUnanimous: boolean;
  pointsAwarded: number;
  votes: Record<string, number>;
}

interface GameState {
  socket: Socket | null;
  connected: boolean;
  gameId: string | null;
  playerId: string | null;
  playerName: string | null;
  game: GameSession | null;
  currentPrompt: Prompt | null;
  submissions: Record<string, ImageSubmission>;
  votingResults: Record<string, VotingResult>;
  error: string | null;
  
  // Connection methods
  connect: () => void;
  disconnect: () => void;
  
  // Game actions
  createGame: (playerName: string, maxPlayers?: number) => void;
  joinGame: (playerName: string, joinCode: string) => void;
  setReady: (isReady: boolean) => void;
  startGame: () => void;
  submitPrompt: (promptText: string) => void;
  submitVote: (submissionId: string) => void;
  leaveGame: () => void;
  
  // State setters (for internal use)
  setError: (error: string | null) => void;
  setGameSession: (gameSession: GameSession | null) => void;
  setCurrentPrompt: (prompt: Prompt | null) => void;
  addSubmission: (submission: ImageSubmission) => void;
  addVotingResult: (result: VotingResult) => void;
}

// Create socket.io client store with Zustand
export const useGameStore = create<GameState>((set, get) => ({
  socket: null,
  connected: false,
  gameId: null,
  playerId: null,
  playerName: null,
  game: null,
  currentPrompt: null,
  submissions: {},
  votingResults: {},
  error: null,
  
  // Connect to socket server
  connect: () => {
    try {
      // Use relative URL in production, explicit URL in development
      const socketUrl = process.env.NODE_ENV === 'production' 
        ? '/' 
        : 'http://localhost:3001';
      
      const socket = io(socketUrl, {
        transports: ['websocket'],
        autoConnect: true
      });
      
      // Set up event listeners
      socket.on('connect', () => {
        set({ connected: true, error: null });
        console.log('Connected to socket server');
      });
      
      socket.on('disconnect', () => {
        set({ connected: false });
        console.log('Disconnected from socket server');
      });
      
      socket.on('error', ({ message }) => {
        set({ error: message });
        console.error('Socket error:', message);
      });
      
      // Game creation events
      socket.on('game-created', ({ gameId, joinCode, playerId, game }) => {
        set({ 
          gameId, 
          playerId, 
          game: {
            ...game,
            joinCode
          },
          error: null 
        });
        console.log(`Game created with ID: ${gameId}, code: ${joinCode}`);
      });
      
      socket.on('game-joined', ({ gameId, playerId, game }) => {
        set({ 
          gameId, 
          playerId, 
          game,
          error: null 
        });
        console.log(`Joined game with ID: ${gameId}`);
      });
      
      // Player events
      socket.on('player-joined', ({ player }) => {
        const currentGame = get().game;
        if (currentGame) {
          set({
            game: {
              ...currentGame,
              players: {
                ...currentGame.players,
                [player.id]: player
              }
            }
          });
        }
        console.log(`Player joined: ${player.name}`);
      });
      
      socket.on('player-left', ({ playerId }) => {
        const currentGame = get().game;
        if (currentGame && currentGame.players[playerId]) {
          const updatedPlayers = { ...currentGame.players };
          delete updatedPlayers[playerId];
          
          set({
            game: {
              ...currentGame,
              players: updatedPlayers
            }
          });
          console.log(`Player left: ${playerId}`);
        }
      });
      
      socket.on('player-status-updated', ({ playerId, isReady }) => {
        const currentGame = get().game;
        if (currentGame && currentGame.players[playerId]) {
          set({
            game: {
              ...currentGame,
              players: {
                ...currentGame.players,
                [playerId]: {
                  ...currentGame.players[playerId],
                  isReady
                }
              }
            }
          });
        }
      });
      
      socket.on('host-changed', ({ newHostId }) => {
        const currentGame = get().game;
        if (currentGame) {
          const updatedPlayers = { ...currentGame.players };
          
          // Update host status for all players
          Object.keys(updatedPlayers).forEach(pid => {
            updatedPlayers[pid] = {
              ...updatedPlayers[pid],
              isHost: pid === newHostId
            };
          });
          
          set({
            game: {
              ...currentGame,
              hostId: newHostId,
              players: updatedPlayers
            }
          });
          console.log(`New host: ${newHostId}`);
        }
      });
      
      // Game flow events
      socket.on('all-players-ready', () => {
        console.log('All players are ready');
      });
      
      socket.on('game-started', ({ currentRound, currentPromptIndex, prompt }) => {
        const currentGame = get().game;
        if (currentGame) {
          set({
            game: {
              ...currentGame,
              status: 'playing',
              currentRound,
              currentPromptIndex
            },
            currentPrompt: prompt
          });
        }
        console.log(`Game started, round ${currentRound}, prompt: ${prompt.text}`);
      });
      
      socket.on('prompt-submitted', ({ submissionId }) => {
        console.log(`Prompt submitted, ID: ${submissionId}`);
      });
      
      socket.on('voting-started', ({ promptId, submissions }) => {
        const updatedSubmissions = { ...get().submissions };
        
        // Add all submissions for this prompt
        submissions.forEach((submission: ImageSubmission) => {
          updatedSubmissions[submission.id] = submission;
        });
        
        set({
          submissions: updatedSubmissions
        });
        console.log(`Voting started for prompt: ${promptId}`);
      });
      
      socket.on('vote-submitted', () => {
        console.log('Vote submitted');
      });
      
      socket.on('voting-results', (result) => {
        const { promptId, winningSubmissionId, isUnanimous, pointsAwarded } = result;
        
        set({
          votingResults: {
            ...get().votingResults,
            [promptId]: result
          }
        });
        
        console.log(`Voting results: ${winningSubmissionId} won ${pointsAwarded} points`);
      });
      
      socket.on('next-prompt', ({ promptId, text, currentRound, currentPromptIndex }) => {
        const currentGame = get().game;
        if (currentGame) {
          set({
            game: {
              ...currentGame,
              currentRound,
              currentPromptIndex
            },
            currentPrompt: {
              id: promptId,
              text
            }
          });
        }
        console.log(`Next prompt: ${text}`);
      });
      
      socket.on('round-ended', ({ currentRound, players, results }) => {
        const currentGame = get().game;
        if (currentGame) {
          set({
            game: {
              ...currentGame,
              currentRound,
              players
            }
          });
        }
        console.log(`Round ended, next round: ${currentRound}`);
      });
      
      socket.on('game-ended', ({ players, results }) => {
        const currentGame = get().game;
        if (currentGame) {
          set({
            game: {
              ...currentGame,
              status: 'completed',
              players
            }
          });
        }
        console.log('Game ended');
      });
      
      set({ socket });
    } catch (error) {
      console.error('Socket connection error:', error);
      set({ error: 'Failed to connect to game server' });
    }
  },
  
  // Disconnect from socket server
  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ 
        socket: null,
        connected: false,
        gameId: null,
        playerId: null,
        game: null,
        currentPrompt: null,
        submissions: {},
        votingResults: {}
      });
    }
  },
  
  // Create a new game
  createGame: (playerName, maxPlayers = 8) => {
    const { socket } = get();
    if (socket && socket.connected) {
      set({ playerName });
      socket.emit('create-game', { playerName, maxPlayers });
    } else {
      set({ error: 'Not connected to game server' });
    }
  },
  
  // Join an existing game
  joinGame: (playerName, joinCode) => {
    const { socket } = get();
    if (socket && socket.connected) {
      set({ playerName });
      socket.emit('join-game', { playerName, joinCode });
    } else {
      set({ error: 'Not connected to game server' });
    }
  },
  
  // Set player ready status
  setReady: (isReady) => {
    const { socket, gameId, playerId } = get();
    if (socket && gameId && playerId) {
      socket.emit('player-ready', { gameId, playerId, isReady });
    }
  },
  
  // Start the game (host only)
  startGame: () => {
    const { socket, gameId, playerId } = get();
    if (socket && gameId && playerId) {
      socket.emit('start-game', { gameId, playerId });
    }
  },
  
  // Submit a prompt for AI image generation
  submitPrompt: (promptText) => {
    const { socket, gameId, playerId, currentPrompt } = get();
    if (socket && gameId && playerId && currentPrompt) {
      socket.emit('submit-prompt', { 
        gameId, 
        playerId, 
        promptId: currentPrompt.id, 
        promptText 
      });
    }
  },
  
  // Submit a vote for an image
  submitVote: (submissionId) => {
    const { socket, gameId, playerId, currentPrompt } = get();
    if (socket && gameId && playerId && currentPrompt) {
      socket.emit('submit-vote', { 
        gameId, 
        playerId, 
        promptId: currentPrompt.id, 
        submissionId 
      });
    }
  },
  
  // Leave the current game
  leaveGame: () => {
    const { socket, gameId, playerId } = get();
    if (socket && gameId && playerId) {
      socket.emit('leave-game', { gameId, playerId });
      set({ 
        gameId: null,
        playerId: null,
        game: null,
        currentPrompt: null,
        submissions: {},
        votingResults: {}
      });
    }
  },
  
  // State setters
  setError: (error) => set({ error }),
  setGameSession: (game) => set({ game }),
  setCurrentPrompt: (prompt) => set({ currentPrompt: prompt }),
  addSubmission: (submission) => set({ 
    submissions: {
      ...get().submissions,
      [submission.id]: submission
    }
  }),
  addVotingResult: (result) => set({
    votingResults: {
      ...get().votingResults,
      [result.promptId]: result
    }
  })
}));

// Hook to initialize socket connection
export function useSocketInitializer() {
  const { connect, disconnect } = useGameStore();
  
  // Connect on component mount, disconnect on unmount
  React.useEffect(() => {
    connect();
    return () => disconnect();
  }, []);
  
  return useGameStore();
}
