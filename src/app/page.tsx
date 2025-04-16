import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 to-indigo-600">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold text-white"
          >
            AI Party Game
          </motion.h1>
          
          <div>
            <SignedIn>
              <div className="flex items-center gap-4">
                <Link href="/profile">
                  <button className="text-white hover:text-purple-200 transition">
                    Profile
                  </button>
                </Link>
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="bg-white text-purple-600 hover:bg-purple-100 px-4 py-2 rounded-full font-medium transition">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
          </div>
        </header>
        
        <main>
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="md:w-1/2"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Create Hilarious AI Images & Vote for the Best!
              </h2>
              <p className="text-purple-100 text-lg mb-8">
                Join up to 8 players in this fun party game where you create funny cartoon scenes using AI image generation. Respond to prompts, vote for your favorites, and compete for the highest score!
              </p>
              
              <div className="flex flex-wrap gap-4">
                <SignedIn>
                  <Link href="/game/lobby">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-white text-purple-600 hover:bg-purple-100 px-6 py-3 rounded-full font-bold shadow-lg transition"
                    >
                      Start Playing
                    </motion.button>
                  </Link>
                </SignedIn>
                <SignedOut>
                  <Link href="/sign-up">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-white text-purple-600 hover:bg-purple-100 px-6 py-3 rounded-full font-bold shadow-lg transition"
                    >
                      Sign Up to Play
                    </motion.button>
                  </Link>
                </SignedOut>
                <Link href="#how-to-play">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-6 py-3 rounded-full font-bold transition"
                  >
                    How to Play
                  </motion.button>
                </Link>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="md:w-1/2"
            >
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                <div className="aspect-video bg-purple-300/50 rounded-lg flex items-center justify-center">
                  <p className="text-white text-xl font-medium">Game Preview Image</p>
                </div>
              </div>
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-24 text-center" 
            id="how-to-play"
          >
            <h2 className="text-3xl font-bold text-white mb-12">How to Play</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                <div className="w-16 h-16 bg-purple-300/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Create Prompts</h3>
                <p className="text-purple-100">
                  Each round, you'll receive a creative prompt and respond by entering text for an AI image generator.
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                <div className="w-16 h-16 bg-purple-300/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Vote for the Best</h3>
                <p className="text-purple-100">
                  See what images other players created and vote for your favorite. The funnier, the better!
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                <div className="w-16 h-16 bg-purple-300/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Score Points</h3>
                <p className="text-purple-100">
                  Earn 100 points for each vote your image receives. Get a unanimous vote for a 1000-point bonus!
                </p>
              </div>
            </div>
          </motion.div>
        </main>
        
        <footer className="mt-24 text-center text-purple-200 text-sm">
          <p>© 2025 AI Party Game. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
