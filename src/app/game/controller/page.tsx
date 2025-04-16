"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useGameLogic } from '@/hooks/useGameLogic';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function GameController() {
  const router = useRouter();
  const {
    gameId,
    joinCode,
    status,
    currentRound,
    currentPromptIndex,
    currentPrompt,
    players,
    
    isPlayerHost,
    canStartGame,
    getPromptSubmissions,
    getVotableSubmissions,
    isGameComplete,
    getWinner
  } = useGameLogic();
  
  // Redirect based on game state
  useEffect(() => {
    if (!gameId) {
      router.push('/game/lobby');
      return;
    }
    
    switch (status) {
      case 'waiting':
        router.push('/game/waiting-room');
        break;
      case 'playing':
        router.push('/game/prompt');
        break;
      case 'voting':
        router.push('/game/vote');
        break;
      case 'results':
        router.push('/game/scoreboard');
        break;
      case 'completed':
        router.push('/game/scoreboard');
        break;
    }
  }, [gameId, status, router]);
  
  // Render a loading state while redirecting
  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-xl shadow-xl text-center"
      >
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700 mx-auto mb-4"></div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Loading Game</h2>
        <p className="text-gray-600">
          {status === 'waiting' && 'Setting up the waiting room...'}
          {status === 'playing' && 'Preparing your prompt...'}
          {status === 'voting' && 'Getting ready to vote...'}
          {status === 'results' && 'Calculating scores...'}
          {status === 'completed' && 'Finalizing game results...'}
        </p>
      </motion.div>
    </div>
  );
}
