// Socket.IO server setup for AI Party Game
import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { createServer } from 'http';

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
  prompts: Record<string, string>;
  submissions: Record<string, ImageSubmission>;
  votes: Record<string, Record<string, string>>;
  results: Record<string, RoundResult>;
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

interface RoundResult {
  promptId: string;
  winningSubmissionId: string;
  isUnanimous: boolean;
  pointsAwarded: number;
}

// In-memory storage (would be replaced with database in production)
const games: Record<string, GameSession> = {};
const playerSessions: Record<string, string> = {}; // socketId -> gameId

// Sample prompts
const samplePrompts = [
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
  "The most over-the-top wedding ever"
];

// Generate a random 6-character game code
function generateGameCode(): string {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Select random prompts for a game
function selectGamePrompts(): Record<string, string> {
  const prompts: Record<string, string> = {};
  const shuffled = [...samplePrompts].sort(() => 0.5 - Math.random());
  
  // For 3 rounds with 4 prompts each
  for (let round = 1; round <= 3; round++) {
    for (let promptIndex = 0; promptIndex < 4; promptIndex++) {
      const index = (round - 1) * 4 + promptIndex;
      const promptId = `${round}-${promptIndex}`;
      prompts[promptId] = shuffled[index % shuffled.length];
    }
  }
  
  return prompts;
}

// Initialize Socket.IO server
export function initSocketServer(server: any) {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log(`New connection: ${socket.id}`);

    // Create a new game
    socket.on('create-game', ({ playerName, maxPlayers = 8 }) => {
      try {
        const gameId = uuidv4();
        const joinCode = generateGameCode();
        const playerId = uuidv4();
        
        // Create player
        const player: Player = {
          id: playerId,
          name: playerName,
          socketId: socket.id,
          isHost: true,
          isReady: false,
          score: 0
        };
        
        // Create game session
        const game: GameSession = {
          id: gameId,
          joinCode,
          status: 'waiting',
          players: { [playerId]: player },
          hostId: playerId,
          currentRound: 1,
          currentPromptIndex: 0,
          maxPlayers,
          prompts: selectGamePrompts(),
          submissions: {},
          votes: {},
          results: {}
        };
        
        // Store game
        games[gameId] = game;
        playerSessions[socket.id] = gameId;
        
        // Join socket room
        socket.join(gameId);
        
        // Send confirmation
        socket.emit('game-created', {
          gameId,
          joinCode,
          playerId,
          game: {
            ...game,
            // Don't send all prompts to client at once
            prompts: {}
          }
        });
        
        console.log(`Game created: ${gameId} with code ${joinCode}`);
      } catch (error) {
        console.error('Error creating game:', error);
        socket.emit('error', { message: 'Failed to create game' });
      }
    });

    // Join an existing game
    socket.on('join-game', ({ playerName, joinCode }) => {
      try {
        // Find game by join code
        const gameId = Object.keys(games).find(id => games[id].joinCode === joinCode);
        
        if (!gameId || !games[gameId]) {
          return socket.emit('error', { message: 'Game not found' });
        }
        
        const game = games[gameId];
        
        // Check if game is joinable
        if (game.status !== 'waiting') {
          return socket.emit('error', { message: 'Game already in progress' });
        }
        
        // Check if game is full
        if (Object.keys(game.players).length >= game.maxPlayers) {
          return socket.emit('error', { message: 'Game is full' });
        }
        
        // Create player
        const playerId = uuidv4();
        const player: Player = {
          id: playerId,
          name: playerName,
          socketId: socket.id,
          isHost: false,
          isReady: false,
          score: 0
        };
        
        // Add player to game
        game.players[playerId] = player;
        playerSessions[socket.id] = gameId;
        
        // Join socket room
        socket.join(gameId);
        
        // Send confirmation to player
        socket.emit('game-joined', {
          gameId,
          playerId,
          game: {
            ...game,
            // Don't send all prompts to client at once
            prompts: {}
          }
        });
        
        // Notify other players
        socket.to(gameId).emit('player-joined', {
          player
        });
        
        console.log(`Player ${playerName} joined game ${gameId}`);
      } catch (error) {
        console.error('Error joining game:', error);
        socket.emit('error', { message: 'Failed to join game' });
      }
    });

    // Player ready status update
    socket.on('player-ready', ({ gameId, playerId, isReady }) => {
      try {
        const game = games[gameId];
        if (!game) {
          return socket.emit('error', { message: 'Game not found' });
        }
        
        const player = game.players[playerId];
        if (!player) {
          return socket.emit('error', { message: 'Player not found' });
        }
        
        // Update player ready status
        player.isReady = isReady;
        
        // Broadcast to all players in the game
        io.to(gameId).emit('player-status-updated', {
          playerId,
          isReady
        });
        
        // Check if all players are ready
        const allReady = Object.values(game.players).every(p => p.isReady);
        if (allReady && Object.keys(game.players).length >= 2) {
          io.to(gameId).emit('all-players-ready');
        }
      } catch (error) {
        console.error('Error updating player ready status:', error);
        socket.emit('error', { message: 'Failed to update ready status' });
      }
    });

    // Start game (host only)
    socket.on('start-game', ({ gameId, playerId }) => {
      try {
        const game = games[gameId];
        if (!game) {
          return socket.emit('error', { message: 'Game not found' });
        }
        
        // Verify host
        if (game.hostId !== playerId) {
          return socket.emit('error', { message: 'Only the host can start the game' });
        }
        
        // Check minimum players
        if (Object.keys(game.players).length < 2) {
          return socket.emit('error', { message: 'Need at least 2 players to start' });
        }
        
        // Update game status
        game.status = 'playing';
        
        // Send first prompt to all players
        const promptId = `${game.currentRound}-${game.currentPromptIndex}`;
        const promptText = game.prompts[promptId];
        
        io.to(gameId).emit('game-started', {
          gameId,
          currentRound: game.currentRound,
          currentPromptIndex: game.currentPromptIndex,
          prompt: {
            id: promptId,
            text: promptText
          }
        });
        
        console.log(`Game ${gameId} started`);
      } catch (error) {
        console.error('Error starting game:', error);
        socket.emit('error', { message: 'Failed to start game' });
      }
    });

    // Submit image prompt
    socket.on('submit-prompt', ({ gameId, playerId, promptId, promptText }) => {
      try {
        const game = games[gameId];
        if (!game) {
          return socket.emit('error', { message: 'Game not found' });
        }
        
        // Create submission
        const submissionId = uuidv4();
        const submission: ImageSubmission = {
          id: submissionId,
          playerId,
          promptId,
          promptText,
          imageUrl: '', // Would be filled by AI image generation
          round: game.currentRound,
          promptIndex: game.currentPromptIndex
        };
        
        // Store submission
        game.submissions[submissionId] = submission;
        
        // Acknowledge submission
        socket.emit('prompt-submitted', {
          submissionId
        });
        
        // Check if all players have submitted for this prompt
        const promptSubmissions = Object.values(game.submissions).filter(
          s => s.round === game.currentRound && s.promptIndex === game.currentPromptIndex
        );
        
        // In a real game, we'd check if we have submissions from all players assigned to this prompt
        // For simplicity, we'll just check if we have at least 2 submissions
        if (promptSubmissions.length >= 2) {
          // Move to voting phase
          io.to(gameId).emit('voting-started', {
            promptId,
            submissions: promptSubmissions
          });
        }
      } catch (error) {
        console.error('Error submitting prompt:', error);
        socket.emit('error', { message: 'Failed to submit prompt' });
      }
    });

    // Submit vote
    socket.on('submit-vote', ({ gameId, playerId, promptId, submissionId }) => {
      try {
        const game = games[gameId];
        if (!game) {
          return socket.emit('error', { message: 'Game not found' });
        }
        
        // Initialize votes for this prompt if needed
        if (!game.votes[promptId]) {
          game.votes[promptId] = {};
        }
        
        // Record vote
        game.votes[promptId][playerId] = submissionId;
        
        // Acknowledge vote
        socket.emit('vote-submitted');
        
        // Check if all players have voted
        const votingPlayers = Object.keys(game.players).filter(pid => {
          // Players don't vote on their own submissions
          const playerSubmission = Object.values(game.submissions).find(
            s => s.promptId === promptId && s.playerId === pid
          );
          return !playerSubmission;
        });
        
        const votes = game.votes[promptId] || {};
        const allVoted = votingPlayers.every(pid => votes[pid]);
        
        if (allVoted) {
          // Count votes
          const voteCounts: Record<string, number> = {};
          Object.values(votes).forEach(sid => {
            voteCounts[sid] = (voteCounts[sid] || 0) + 1;
          });
          
          // Find winner
          let winningSubmissionId = '';
          let maxVotes = 0;
          
          Object.entries(voteCounts).forEach(([sid, count]) => {
            if (count > maxVotes) {
              maxVotes = count;
              winningSubmissionId = sid;
            }
          });
          
          // Check if unanimous
          const isUnanimous = maxVotes === votingPlayers.length;
          
          // Award points
          const pointsAwarded = isUnanimous ? 1000 : maxVotes * 100;
          const winningSubmission = game.submissions[winningSubmissionId];
          
          if (winningSubmission) {
            const winner = game.players[winningSubmission.playerId];
            if (winner) {
              winner.score += pointsAwarded;
            }
          }
          
          // Record result
          game.results[promptId] = {
            promptId,
            winningSubmissionId,
            isUnanimous,
            pointsAwarded
          };
          
          // Send results to all players
          io.to(gameId).emit('voting-results', {
            promptId,
            winningSubmissionId,
            isUnanimous,
            pointsAwarded,
            votes: voteCounts
          });
          
          // Check if we need to move to next prompt or round
          game.currentPromptIndex++;
          
          if (game.currentPromptIndex >= 4) {
            // End of round
            game.currentPromptIndex = 0;
            game.currentRound++;
            
            // Send scoreboard
            io.to(gameId).emit('round-ended', {
              currentRound: game.currentRound,
              players: game.players,
              results: game.results
            });
            
            if (game.currentRound > 3) {
              // Game over
              game.status = 'completed';
              
              io.to(gameId).emit('game-ended', {
                players: game.players,
                results: game.results
              });
            } else {
              // Start next round after delay (would be handled by client)
            }
          } else {
            // Move to next prompt
            const nextPromptId = `${game.currentRound}-${game.currentPromptIndex}`;
            const nextPromptText = game.prompts[nextPromptId];
            
            io.to(gameId).emit('next-prompt', {
              promptId: nextPromptId,
              text: nextPromptText,
              currentRound: game.currentRound,
              currentPromptIndex: game.currentPromptIndex
            });
          }
        }
      } catch (error) {
        console.error('Error submitting vote:', error);
        socket.emit('error', { message: 'Failed to submit vote' });
      }
    });

    // Leave game
    socket.on('leave-game', ({ gameId, playerId }) => {
      try {
        handlePlayerDisconnect(socket.id);
      } catch (error) {
        console.error('Error leaving game:', error);
      }
    });

    // Disconnect handler
    socket.on('disconnect', () => {
      try {
        handlePlayerDisconnect(socket.id);
      } catch (error) {
        console.error('Error handling disconnect:', error);
      }
    });

    // Handle player disconnect
    function handlePlayerDisconnect(socketId: string) {
      const gameId = playerSessions[socketId];
      if (!gameId || !games[gameId]) return;
      
      const game = games[gameId];
      
      // Find player by socket ID
      const playerId = Object.keys(game.players).find(
        pid => game.players[pid].socketId === socketId
      );
      
      if (!playerId) return;
      
      const player = game.players[playerId];
      
      // Remove player from game
      delete game.players[playerId];
      delete playerSessions[socketId];
      
      // Notify other players
      socket.to(gameId).emit('player-left', {
        playerId
      });
      
      console.log(`Player ${player.name} left game ${gameId}`);
      
      // If host left, assign new host or end game
      if (player.isHost && Object.keys(game.players).length > 0) {
        const newHostId = Object.keys(game.players)[0];
        game.hostId = newHostId;
        game.players[newHostId].isHost = true;
        
        socket.to(gameId).emit('host-changed', {
          newHostId
        });
      } else if (Object.keys(game.players).length === 0) {
        // No players left, clean up game
        delete games[gameId];
        console.log(`Game ${gameId} removed - no players left`);
      }
    }
  });

  return io;
}

// Create standalone Socket.IO server if needed
export function createSocketServer(port = 3001) {
  const httpServer = createServer();
  const io = initSocketServer(httpServer);
  
  httpServer.listen(port, () => {
    console.log(`Socket.IO server running on port ${port}`);
  });
  
  return io;
}
