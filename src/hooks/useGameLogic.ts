"use client";

import { useEffect } from 'react';
import { useGameStore, generateGamePrompts } from '@/lib/gameStore';
import { useSocketInitializer } from '@/lib/socketClient';

export function useGameLogic() {
  const socket = useSocketInitializer();
  const {
    gameId,
    joinCode,
    playerId,
    playerName,
    status,
    currentRound,
    currentPromptIndex,
    players,
    prompts,
    currentPrompt,
    submissions,
    votes,
    results,
    
    setGameSession,
    setPlayerId,
    setGameStatus,
    setCurrentRound,
    setCurrentPromptIndex,
    setCurrentPrompt,
    addPlayer,
    removePlayer,
    updatePlayerStatus,
    updatePlayerScore,
    addPrompt,
    addSubmission,
    addVote,
    addResult,
    resetGame,
    
    isPlayerHost,
    canStartGame,
    getPromptSubmissions,
    getPlayerSubmission,
    hasPlayerVoted,
    getVotableSubmissions,
    calculateRoundResults,
    isRoundComplete,
    isGameComplete,
    getWinner
  } = useGameStore();

  // Create a new game
  const createGame = (playerName: string, maxPlayers = 8) => {
    if (socket.connected) {
      socket.createGame(playerName, maxPlayers);
    }
  };

  // Join an existing game
  const joinGame = (playerName: string, joinCode: string) => {
    if (socket.connected) {
      socket.joinGame(playerName, joinCode);
    }
  };

  // Set player ready status
  const setReady = (isReady: boolean) => {
    if (socket.connected && gameId && playerId) {
      socket.setReady(isReady);
    }
  };

  // Start the game (host only)
  const startGame = () => {
    if (socket.connected && gameId && playerId && isPlayerHost()) {
      socket.startGame();
      
      // Generate prompts for the game
      const gamePrompts = generateGamePrompts();
      gamePrompts.forEach(prompt => addPrompt(prompt));
      
      // Set the first prompt
      const firstPrompt = gamePrompts.find(p => p.round === 1 && p.promptIndex === 0);
      if (firstPrompt) {
        setCurrentPrompt(firstPrompt);
      }
      
      setGameStatus('playing');
    }
  };

  // Submit a prompt for AI image generation
  const submitPrompt = (promptText: string, imageUrl: string) => {
    if (socket.connected && gameId && playerId && currentPrompt) {
      // Create a submission object
      const submission = {
        id: `${playerId}-${currentPrompt.id}`,
        playerId,
        promptId: currentPrompt.id,
        promptText,
        imageUrl,
        round: currentRound,
        promptIndex: currentPromptIndex
      };
      
      // Add to local state
      addSubmission(submission);
      
      // Send to server
      socket.submitPrompt(promptText);
    }
  };

  // Submit a vote for an image
  const submitVote = (submissionId: string) => {
    if (socket.connected && gameId && playerId && currentPrompt) {
      // Create a vote object
      const vote = {
        playerId,
        submissionId,
        promptId: currentPrompt.id
      };
      
      // Add to local state
      addVote(vote);
      
      // Send to server
      socket.submitVote(submissionId);
    }
  };

  // Move to next prompt or round
  const moveToNextPrompt = () => {
    if (!currentPrompt) return;
    
    // Calculate results for current prompt
    const result = calculateRoundResults(currentPrompt.id);
    addResult(result);
    
    // Update score for winning player
    if (result.winningSubmissionId) {
      const winningSubmission = submissions[result.winningSubmissionId];
      if (winningSubmission) {
        updatePlayerScore(winningSubmission.playerId, result.pointsAwarded);
      }
    }
    
    // Check if round is complete
    if (currentPromptIndex >= 3) {
      // End of round
      if (currentRound >= 3) {
        // Game over
        setGameStatus('completed');
      } else {
        // Move to next round
        setCurrentRound(currentRound + 1);
        setCurrentPromptIndex(0);
        setGameStatus('results');
      }
    } else {
      // Move to next prompt in current round
      setCurrentPromptIndex(currentPromptIndex + 1);
    }
    
    // Set the new current prompt
    const nextPrompt = Object.values(prompts).find(
      p => p.round === currentRound && p.promptIndex === currentPromptIndex
    );
    
    if (nextPrompt) {
      setCurrentPrompt(nextPrompt);
      setGameStatus('playing');
    }
  };

  // Continue to next round from results screen
  const continueToNextRound = () => {
    if (status === 'results') {
      const nextPrompt = Object.values(prompts).find(
        p => p.round === currentRound && p.promptIndex === 0
      );
      
      if (nextPrompt) {
        setCurrentPrompt(nextPrompt);
        setGameStatus('playing');
      }
    }
  };

  // Leave the current game
  const leaveGame = () => {
    if (socket.connected && gameId && playerId) {
      socket.leaveGame();
      resetGame();
    }
  };

  // Play again (reset game)
  const playAgain = () => {
    if (isPlayerHost()) {
      resetGame();
      setGameStatus('waiting');
    }
  };

  // Socket event handlers
  useEffect(() => {
    if (!socket.socket) return;

    // Game creation events
    socket.socket.on('game-created', ({ gameId, joinCode, playerId, game }) => {
      setGameSession(gameId, joinCode);
      setPlayerId(playerId, game.players[playerId].name);
      
      // Add all players
      Object.values(game.players).forEach(player => {
        addPlayer(player);
      });
    });
    
    socket.socket.on('game-joined', ({ gameId, playerId, game }) => {
      setGameSession(gameId, game.joinCode);
      setPlayerId(playerId, game.players[playerId].name);
      
      // Add all players
      Object.values(game.players).forEach(player => {
        addPlayer(player);
      });
    });
    
    // Player events
    socket.socket.on('player-joined', ({ player }) => {
      addPlayer(player);
    });
    
    socket.socket.on('player-left', ({ playerId }) => {
      removePlayer(playerId);
    });
    
    socket.socket.on('player-status-updated', ({ playerId, isReady }) => {
      updatePlayerStatus(playerId, isReady);
    });
    
    // Game flow events
    socket.socket.on('game-started', ({ currentRound, currentPromptIndex, prompt }) => {
      setCurrentRound(currentRound);
      setCurrentPromptIndex(currentPromptIndex);
      setCurrentPrompt(prompt);
      setGameStatus('playing');
    });
    
    socket.socket.on('voting-started', ({ promptId, submissions: serverSubmissions }) => {
      // Add all submissions
      serverSubmissions.forEach(submission => {
        addSubmission(submission);
      });
      
      setGameStatus('voting');
    });
    
    socket.socket.on('voting-results', (result) => {
      addResult(result);
      
      // Update score for winning player
      if (result.winningSubmissionId) {
        const winningSubmission = submissions[result.winningSubmissionId];
        if (winningSubmission) {
          updatePlayerScore(winningSubmission.playerId, result.pointsAwarded);
        }
      }
    });
    
    socket.socket.on('next-prompt', ({ promptId, text, currentRound, currentPromptIndex }) => {
      setCurrentRound(currentRound);
      setCurrentPromptIndex(currentPromptIndex);
      setCurrentPrompt({
        id: promptId,
        text,
        round: currentRound,
        promptIndex: currentPromptIndex
      });
      setGameStatus('playing');
    });
    
    socket.socket.on('round-ended', ({ currentRound, players: updatedPlayers }) => {
      setCurrentRound(currentRound);
      setCurrentPromptIndex(0);
      
      // Update player scores
      Object.values(updatedPlayers).forEach(player => {
        if (players[player.id]) {
          updatePlayerScore(player.id, player.score - players[player.id].score);
        }
      });
      
      setGameStatus('results');
    });
    
    socket.socket.on('game-ended', ({ players: updatedPlayers }) => {
      // Update player scores
      Object.values(updatedPlayers).forEach(player => {
        if (players[player.id]) {
          updatePlayerScore(player.id, player.score - players[player.id].score);
        }
      });
      
      setGameStatus('completed');
    });
    
    return () => {
      // Clean up event listeners
      socket.socket?.off('game-created');
      socket.socket?.off('game-joined');
      socket.socket?.off('player-joined');
      socket.socket?.off('player-left');
      socket.socket?.off('player-status-updated');
      socket.socket?.off('game-started');
      socket.socket?.off('voting-started');
      socket.socket?.off('voting-results');
      socket.socket?.off('next-prompt');
      socket.socket?.off('round-ended');
      socket.socket?.off('game-ended');
    };
  }, [socket.socket, submissions, players]);

  return {
    // State
    gameId,
    joinCode,
    playerId,
    playerName,
    status,
    currentRound,
    currentPromptIndex,
    players,
    prompts,
    currentPrompt,
    submissions,
    votes,
    results,
    
    // Actions
    createGame,
    joinGame,
    setReady,
    startGame,
    submitPrompt,
    submitVote,
    moveToNextPrompt,
    continueToNextRound,
    leaveGame,
    playAgain,
    
    // Helpers
    isPlayerHost,
    canStartGame,
    getPromptSubmissions,
    getPlayerSubmission,
    hasPlayerVoted,
    getVotableSubmissions,
    isRoundComplete,
    isGameComplete,
    getWinner
  };
}
