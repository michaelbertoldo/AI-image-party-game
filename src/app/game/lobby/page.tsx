import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';

export default function GameLobby() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 to-indigo-600 p-4">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
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
          
          <div className="flex items-center gap-4">
            <Link href="/profile">
              <button className="text-white hover:text-purple-200 transition">
                Profile
              </button>
            </Link>
            <UserButton afterSignOutUrl="/" />
          </div>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl shadow-xl overflow-hidden"
            >
              <div className="bg-purple-600 p-4">
                <h2 className="text-xl font-bold text-white">Game Lobby</h2>
              </div>
              
              <div className="p-6">
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">Create New Game</h3>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-grow">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Your Name
                      </label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter your display name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Max Players
                      </label>
                      <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
                        <option value="4">4 Players</option>
                        <option value="6">6 Players</option>
                        <option value="8" selected>8 Players</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold py-3 px-6 rounded-md shadow-md"
                    >
                      Create Game
                    </motion.button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Join Existing Game</h3>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-grow">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Your Name
                      </label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter your display name"
                      />
                    </div>
                    <div className="flex-grow">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Game Code
                      </label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter game code"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold py-3 px-6 rounded-md shadow-md"
                    >
                      Join Game
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-xl shadow-xl overflow-hidden"
            >
              <div className="bg-purple-600 p-4">
                <h2 className="text-xl font-bold text-white">Active Games</h2>
              </div>
              
              <div className="p-4">
                <div className="text-center py-8 text-gray-500">
                  No active games found
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
                <h2 className="text-xl font-bold text-white">How to Play</h2>
              </div>
              
              <div className="p-4">
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  <li>Create a new game or join with a code</li>
                  <li>Wait for all players to join (up to 8)</li>
                  <li>Each round, respond to prompts with creative AI image ideas</li>
                  <li>Vote for your favorite images (not your own)</li>
                  <li>Score points for votes received</li>
                  <li>After 3 rounds, the player with the most points wins!</li>
                </ol>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
