import { SignUp } from "@clerk/nextjs";
import { motion } from "framer-motion";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-600 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h1 className="text-4xl font-bold text-white mb-2">AI Party Game</h1>
        <p className="text-white text-lg">Create an account to start playing!</p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <SignUp />
        </div>
      </motion.div>
    </div>
  );
}
