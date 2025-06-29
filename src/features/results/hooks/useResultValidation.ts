import { useState } from 'react';
import type { GameType } from '../types/resultTypes';

export const useResultValidation = () => {
  const [errors, setErrors] = useState<Record<number, string>>({});
  
  const validate = (numbers: number[], gameType: GameType) => {
    const newErrors: Record<number, string> = {};
    
    numbers.forEach((num, index) => {
      if (num <= 0) {
        newErrors[index] = 'Must be positive';
        return;
      }
      
      // Powerball validation (last number)
      if (gameType === 'powerball' && index === numbers.length - 1) {
        if (num > 20) newErrors[index] = 'Max 20 for Powerball';
        return;
      }
      
      // Regular number validation
      if (num > 99) newErrors[index] = 'Max 99';
    });
    
    // Unique numbers check (except Powerball)
    if (gameType !== 'raffle' && gameType !== 'powerball') {
      const unique = new Set(numbers);
      if (unique.size !== numbers.length) {
        numbers.forEach((_, index) => {
          newErrors[index] = 'Numbers must be unique';
        });
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  return { validate, errors };
};