import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';

export default function ScoreboardPage() {
  // Mock data
  const players = [
    { id: '1', name: 'Player 1', score: 1200, rank: 1 },
    { id: '2', name: 'Player 2', score: 800, rank: 2 },
    { id: '3', name: 'Player 3', score: 600, rank: 3 },
    { id: '4', name: 'Player 4', score: 400, rank: 4 },
    { id: '5', name: 'Player 5', score: 200, rank: 5 },
  ];
  
  const gameInfo = {
    currentRound: 2,
    totalRounds: 3,
    isGameOver: false
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 to-indigo-600 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <Link href="/">
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="text-2xl font-bold text-white cursor-pointer"
              >
                AI Party Game
              </motion.h1>
            </Link>
            <div className="bg-white/20 rounded-md px-3 py-1 text-white text-sm">
              Round {gameInfo.currentRound}/{gameInfo.totalRounds}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <UserButton afterSignOutUrl="/" />
          </div>
        </header>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-xl overflow-hidden"
        >
          <div className="bg-purple-600 p-4">
            <h2 className="text-xl font-bold text-white">
              {gameInfo.isGameOver ? 'Final Scores' : 'Current Scores'}
            </h2>
          </div>
          
          <div className="p-6">
            <div className="mb-8">
              {players.map((player, index) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                  className={`flex items-center p-4 mb-3 rounded-lg ${
                    index === 0 
                      ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 border-2 border-yellow-400' 
                      : index === 1 
                        ? 'bg-gradient-to-r from-gray-100 to-gray-200 border-2 border-gray-400'
                        : index === 2
                          ? 'bg-gradient-to-r from-orange-100 to-orange-200 border-2 border-orange-400'
                          : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-purple-600 text-white font-bold mr-4">
                    {player.rank}
                  </div>
                  
                  <div className="flex-grow">
                    <h3 className="font-bold text-gray-800">{player.name}</h3>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-700">{player.score}</div>
                    <div className="text-xs text-gray-500">points</div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="flex justify-center">
              {gameInfo.isGameOver ? (
                <div className="space-y-4 text-center">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="bg-purple-100 p-4 rounded-lg mb-4"
                  >
                    <h3 className="text-xl font-bold text-purple-800 mb-2">
                      Game Over!
                    </h3>
                    <p className="text-purple-600">
                      {players[0].name} wins with {players[0].score} points!
                    </p>
                  </motion.div>
                  
                  <div className="flex gap-4 justify-center">
                    <Link href="/game/lobby">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold py-3 px-6 rounded-full shadow-lg"
                      >
                        Play Again
                      </motion.button>
                    </Link>
                    
                    <Link href="/">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-full shadow-lg"
                      >
                        Exit to Home
                      </motion.button>
                    </Link>
                  </div>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold py-3 px-8 rounded-full shadow-lg"
                >
                  Continue to Next Round
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-xl shadow-xl overflow-hidden mt-6"
        >
          <div className="bg-purple-600 p-4">
            <h2 className="text-xl font-bold text-white">Round Highlights</h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-purple-700 mb-2">Best Submission</h3>
                <div className="aspect-video bg-gray-200 flex items-center justify-center mb-2">
                  <div className="text-gray-400">Image Placeholder</div>
                </div>
                <p className="text-sm text-gray-600">
                  "A superhero whose power is to turn anything into cheese, wearing a cape made of swiss cheese"
                </p>
                <p className="text-xs text-gray-500 mt-1">By: Player 1</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-purple-700 mb-2">Unanimous Vote Winner</h3>
                <div className="aspect-video bg-gray-200 flex items-center justify-center mb-2">
                  <div className="text-gray-400">Image Placeholder</div>
                </div>
                <p className="text-sm text-gray-600">
                  "A tiny superhero who can control dust bunnies, riding on a vacuum cleaner"
                </p>
                <p className="text-xs text-gray-500 mt-1">By: Player 2</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
