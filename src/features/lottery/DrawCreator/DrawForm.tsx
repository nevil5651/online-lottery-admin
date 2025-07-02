import  { useState } from 'react';
import { Box, Stepper, Step, StepLabel,  } from '@mui/material';
import { Button } from '../../../components/ui';
import { PrizeTierEditor } from './PrizeTierEditor';
import { SecuritySettings } from './SecuritySettings';
import { DrawSummaryCard } from '../DrawSummaryCard';
import { useDrawValidation } from '../../../hooks/useDrawValidation';
import type { DrawFormData } from '../types';
import { ScheduleControls } from './ScheduleControls';

const steps = ['Schedule', 'Prizes', 'Security', 'Review'];

export const DrawForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<DrawFormData>({
    name: '',
    type: 'daily',
    description: '',
    ticketPrice: 20,
    maxTicketsPerUser: 10,
    schedule: {
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        drawTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
        cutoffMinutes: 30,
        conflictStrategy: 'prevent'
    },
    prizes: [
      { 
        id: '1', 
        name: 'Jackpot', 
        description: 'Grand prize', 
        value: 1000000, 
        valueType: 'fixed', 
        numberOfWinners: 1 
      }
    ],
    security: {
      rngMethod: 'algorithm',
      requiredApprovals: 1,
      auditTrail: true
    }
  });

  const { errors, validateStep } = useDrawValidation();

  const handleNext = () => {
    if (validateStep(activeStep, formData)) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = () => {
    if (validateStep(3, formData)) {
      console.log('Submitting draw:', formData);
      // API call would go here
    }
  };

  const updateFormData = (partialData: Partial<DrawFormData>) => {
    setFormData(prev => ({ ...prev, ...partialData }));
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === 0 && (
        <ScheduleControls 
          schedule={formData.schedule} 
          onChange={(schedule) => updateFormData({ schedule })}
          errors={errors}
        />
      )}

      {activeStep === 1 && (
        <PrizeTierEditor 
          prizes={formData.prizes} 
          onChange={(prizes) => updateFormData({ prizes })}
          errors={errors}
        />
      )}

      {activeStep === 2 && (
        <SecuritySettings 
          security={formData.security} 
          onChange={(security) => updateFormData({ security })}
          errors={errors}
        />
      )}

      {activeStep === 3 && (
        <DrawSummaryCard data={formData} />
      )}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        {activeStep !== 0 && (
          <Button onClick={handleBack} sx={{ mr: 1 }}>
            Back
          </Button>
        )}
        {activeStep === steps.length - 1 ? (
          <Button variant="contained" onClick={handleSubmit}>
            Create Draw
          </Button>
        ) : (
          <Button variant="contained" onClick={handleNext}>
            Next
          </Button>
        )}
      </Box>
    </Box>
  );
};