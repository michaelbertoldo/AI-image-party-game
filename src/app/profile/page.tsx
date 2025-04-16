import { UserButton, SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import { motion } from "framer-motion";
import Link from "next/link";

export default function UserProfilePage() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 to-indigo-600 p-4">
      <SignedIn>
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold text-white"
            >
              Your Profile
            </motion.h1>
            <UserButton afterSignOutUrl="/" />
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-xl shadow-xl p-6"
          >
            <h2 className="text-2xl font-semibold mb-4">Game Stats</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-purple-100 p-4 rounded-lg text-center">
                <p className="text-sm text-purple-600 font-medium">Games Played</p>
                <p className="text-3xl font-bold text-purple-800">0</p>
              </div>
              <div className="bg-indigo-100 p-4 rounded-lg text-center">
                <p className="text-sm text-indigo-600 font-medium">Total Score</p>
                <p className="text-3xl font-bold text-indigo-800">0</p>
              </div>
              <div className="bg-blue-100 p-4 rounded-lg text-center">
                <p className="text-sm text-blue-600 font-medium">Wins</p>
                <p className="text-3xl font-bold text-blue-800">0</p>
              </div>
            </div>
            
            <div className="flex justify-center">
              <Link href="/game/lobby">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold py-3 px-6 rounded-full shadow-lg"
                >
                  Join a Game
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </div>
  );
}
