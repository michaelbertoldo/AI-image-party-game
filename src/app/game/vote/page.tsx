import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';

export default function VotingPage() {
  // Mock data
  const prompt = "A superhero with an unusual power";
  const submissions = [
    {
      id: '1',
      playerName: 'Player 1',
      imageUrl: '/placeholder-image-1.jpg',
      promptText: "A superhero whose power is to turn anything into cheese, wearing a cape made of swiss cheese"
    },
    {
      id: '2',
      playerName: 'Player 2',
      imageUrl: '/placeholder-image-2.jpg',
      promptText: "A tiny superhero who can control dust bunnies, riding on a vacuum cleaner"
    }
  ];
  
  const roundInfo = {
    currentRound: 1,
    totalRounds: 3,
    promptNumber: 1,
    totalPrompts: 4,
    timeRemaining: 30
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 to-indigo-600 p-4">
      <div className="max-w-5xl mx-auto">
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
              Round {roundInfo.currentRound}/{roundInfo.totalRounds}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-white/20 rounded-full px-4 py-1.5 text-white">
              <span className="font-medium">{roundInfo.timeRemaining}s</span>
            </div>
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
            <h2 className="text-xl font-bold text-white">Vote for Your Favorite</h2>
          </div>
          
          <div className="p-6">
            <div className="mb-8 text-center">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-purple-100 p-4 rounded-lg mb-4"
              >
                <h3 className="text-xl font-bold text-purple-800">
                  {prompt}
                </h3>
              </motion.div>
              
              <p className="text-gray-600 text-sm">
                Prompt {roundInfo.promptNumber} of {roundInfo.totalPrompts} in Round {roundInfo.currentRound}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {submissions.map((submission, index) => (
                <motion.div
                  key={submission.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + (index * 0.1) }}
                  className="bg-gray-50 rounded-xl overflow-hidden shadow-md"
                >
                  <div className="aspect-square bg-gray-200 flex items-center justify-center">
                    <div className="text-gray-400 text-lg">Image Placeholder</div>
                  </div>
                  
                  <div className="p-4">
                    <p className="text-sm text-gray-500 mb-2">Prompt used:</p>
                    <p className="text-gray-700 mb-4 text-sm italic">"{submission.promptText}"</p>
                    
                    <div className="flex justify-between items-center">
                      <p className="font-medium text-purple-700">
                        By: {submission.playerName}
                      </p>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold py-2 px-6 rounded-full shadow-md"
                      >
                        Vote
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-8 text-center text-gray-500 text-sm">
              Vote for your favorite image. You cannot vote for your own submission.
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
