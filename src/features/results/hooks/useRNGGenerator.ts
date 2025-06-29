import { useState } from 'react';
import type { GameType } from '../types/resultTypes';

export const useRNGGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  
  const generateNumbers = async (
    gameType: GameType,
    useSecureRNG: boolean
  ): Promise<number[]> => {
    setIsGenerating(true);
    
    try {
      let numbers: number[] = [];
      const counts = {
        pick3: 3,
        pick4: 4,
        pick6: 6,
        powerball: 7,
        raffle: 10
      };
      
      const count = counts[gameType] || 0;
      
      if (useSecureRNG && window.crypto) {
        // Secure RNG using Web Crypto API
        const array = new Uint32Array(count);
        window.crypto.getRandomValues(array);
        numbers = Array.from(array).map(num => 
          gameType === 'powerball' 
            ? (num % 99) + 1 
            : (num % 69) + 1
        );
      } else {
        // Fallback to Math.random (not secure)
        for (let i = 0; i < count; i++) {
          numbers.push(Math.floor(Math.random() * 99) + 1);
        }
      }
      
      // Special handling for Powerball
      if (gameType === 'powerball' && numbers.length > 0) {
        const powerball = numbers.pop()! % 20 + 1;
        return [...numbers, powerball];
      }
      
      return numbers;
    } finally {
      setIsGenerating(false);
    }
  };

  return { generateNumbers, isGenerating };
};