import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';

export default function WaitingRoom() {
  // Mock data for waiting players
  const players = [
    { id: '1', name: 'Player 1', isHost: true, isReady: true },
    { id: '2', name: 'Player 2', isHost: false, isReady: true },
    { id: '3', name: 'Player 3', isHost: false, isReady: false },
  ];

  const gameCode = 'ABC123';
  const maxPlayers = 8;

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 to-indigo-600 p-4">
      <div className="max-w-4xl mx-auto">
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
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-xl overflow-hidden"
        >
          <div className="bg-purple-600 p-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Waiting Room</h2>
            <div className="bg-white/20 rounded-md px-3 py-1">
              <span className="text-white font-medium">Game Code: </span>
              <span className="text-white font-bold">{gameCode}</span>
            </div>
          </div>
          
          <div className="p-6">
            <div className="mb-6 text-center">
              <p className="text-gray-700 mb-2">
                Waiting for players to join... ({players.length}/{maxPlayers})
              </p>
              <p className="text-sm text-gray-500">
                Share the game code with your friends to let them join!
              </p>
            </div>
            
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3">Players</h3>
              <div className="bg-gray-50 rounded-lg p-2">
                {players.map((player) => (
                  <div 
                    key={player.id}
                    className="flex items-center justify-between p-3 border-b border-gray-200 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">{player.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-medium">
                          {player.name} {player.isHost && <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full ml-2">Host</span>}
                        </p>
                      </div>
                    </div>
                    <div>
                      {player.isReady ? (
                        <span className="text-green-600 text-sm font-medium">Ready</span>
                      ) : (
                        <span className="text-orange-500 text-sm font-medium">Not Ready</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold py-3 px-6 rounded-md shadow-md"
              >
                I'm Ready!
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-md shadow-md"
              >
                Leave Game
              </motion.button>
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500 mb-2">
                Game will start when all players are ready
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-green-600 text-white font-bold py-2 px-6 rounded-md shadow-md"
                disabled={!players.every(p => p.isReady)}
              >
                Start Game (Host Only)
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
