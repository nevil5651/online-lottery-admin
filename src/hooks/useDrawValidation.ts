import { useState } from 'react';
import type { DrawFormData } from '../features/lottery/types';

export const useDrawValidation = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (step: number, data: DrawFormData): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Step 0: Schedule validation
    if (step === 0) {
      if (data.schedule.startDate >= data.schedule.endDate) {
        newErrors.schedule = "End date must be after start date";
      }
      
      if (data.schedule.cutoffMinutes < 5) {
        newErrors.cutoff = "Cutoff must be at least 5 minutes";
      }
    }
    
    // Step 1: Prize validation
    if (step === 1) {
      if (data.prizes.length === 0) {
        newErrors.prizes = "At least one prize tier is required";
      }
      
      let totalPercentage = 0;
      data.prizes.forEach((prize, index) => {
        if (!prize.name) {
          newErrors[`prizes[${index}].name`] = "Name is required";
        }
        
        if (prize.value <= 0) {
          newErrors[`prizes[${index}].value`] = "Value must be positive";
        }
        
        if (prize.numberOfWinners < 1) {
          newErrors[`prizes[${index}].winners`] = "At least one winner required";
        }
        
        if (prize.valueType === 'percentage') {
          totalPercentage += prize.value;
        }
      });
      
      if (totalPercentage > 100) {
        newErrors.prizeTotal = "Total prize percentage cannot exceed 100%";
      }
    }
    
    // Step 2: Security validation
    if (step === 2) {
      if (data.security.requiredApprovals < 1) {
        newErrors.requiredApprovals = "At least one approval required";
      }
    }
    
    // Step 3: Overall validation
    if (step === 3) {
      if (!data.name.trim()) {
        newErrors.name = "Draw name is required";
      }
      
      if (data.ticketPrice <= 0) {
        newErrors.ticketPrice = "Ticket price must be positive";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return { errors, validateStep };
};

