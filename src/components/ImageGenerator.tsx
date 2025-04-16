"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface ImageGeneratorProps {
  onImageGenerated: (imageUrl: string, promptText: string) => void;
  promptText: string;
  isDisabled?: boolean;
}

export default function ImageGenerator({ onImageGenerated, promptText, isDisabled = false }: ImageGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);

  const generateImage = async () => {
    if (isDisabled || !promptText || promptText.trim() === '') return;
    
    try {
      setIsGenerating(true);
      setError(null);
      
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ promptText }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }
      
      setGeneratedImageUrl(data.imageUrl);
      onImageGenerated(data.imageUrl, promptText);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error generating image:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full">
      {error && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-4 p-3 bg-red-100 text-red-700 rounded-md"
        >
          {error}
        </motion.div>
      )}
      
      <div className="flex flex-col items-center">
        {generatedImageUrl ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-4 rounded-lg overflow-hidden shadow-lg"
          >
            <img 
              src={generatedImageUrl} 
              alt="AI generated image" 
              className="w-full max-w-md h-auto"
            />
          </motion.div>
        ) : (
          <div className="mb-4 w-full max-w-md aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
            {isGenerating ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
                <p className="mt-4 text-gray-600">Generating your image...</p>
              </div>
            ) : (
              <p className="text-gray-500">Your image will appear here</p>
            )}
          </div>
        )}
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`px-6 py-3 rounded-full font-bold shadow-md ${
            isDisabled || isGenerating
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white'
          }`}
          onClick={generateImage}
          disabled={isDisabled || isGenerating}
        >
          {isGenerating ? 'Generating...' : generatedImageUrl ? 'Regenerate Image' : 'Generate Image'}
        </motion.button>
      </div>
    </div>
  );
}
