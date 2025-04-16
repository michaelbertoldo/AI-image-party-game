import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';

export default function PromptDisplay() {
  // Mock data
  const prompt = "A superhero with an unusual power";
  const roundInfo = {
    currentRound: 1,
    totalRounds: 3,
    promptNumber: 1,
    totalPrompts: 4,
    timeRemaining: 60
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
            <h2 className="text-xl font-bold text-white">Your Prompt</h2>
          </div>
          
          <div className="p-6">
            <div className="mb-8 text-center">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-purple-100 p-6 rounded-lg mb-4"
              >
                <h3 className="text-2xl font-bold text-purple-800 mb-2">
                  {prompt}
                </h3>
                <p className="text-purple-600">
                  Create a funny cartoon-style scene based on this prompt
                </p>
              </motion.div>
              
              <p className="text-gray-600 text-sm">
                Prompt {roundInfo.promptNumber} of {roundInfo.totalPrompts} in Round {roundInfo.currentRound}
              </p>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your AI Image Prompt
              </label>
              <textarea 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[120px]"
                placeholder="Describe a funny cartoon scene for the AI to generate..."
              ></textarea>
              <p className="mt-2 text-sm text-gray-500">
                Be creative! The funnier and more unexpected, the better chance of getting votes.
              </p>
            </div>
            
            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold py-3 px-8 rounded-full shadow-lg"
              >
                Generate Image
              </motion.button>
            </div>
            
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-2">Tips:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Be specific about what you want in the image</li>
                <li>• Include details about style, colors, and composition</li>
                <li>• Think about what would make other players laugh</li>
                <li>• You can mention specific cartoon styles (e.g., "Pixar style")</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
