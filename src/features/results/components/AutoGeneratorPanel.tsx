import React from 'react';
import { 
  Stack, 
  Grid,
  Switch,
  FormControlLabel
} from '@mui/material';
import {Button, Typography } from '../../../components/ui';
import CasinoIcon from '@mui/icons-material/Casino';
import type { GameType } from '../types/resultTypes';
import { useRNGGenerator } from '../hooks/useRNGGenerator';

interface AutoGeneratorPanelProps {
  gameType: GameType;
  onGenerate: (numbers: number[]) => void;
  disabled?: boolean;
}

const AutoGeneratorPanel = ({ gameType, onGenerate }: AutoGeneratorPanelProps) => {
  const [useSecureRNG, setUseSecureRNG] = React.useState(true);
  const { generateNumbers, isGenerating } = useRNGGenerator();
  
  const handleGenerate = async () => {
    const numbers = await generateNumbers(gameType, useSecureRNG);
    onGenerate(numbers);
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Auto Generation
      </Typography>
      
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} md={6}>
          <Stack spacing={2}>
            <FormControlLabel
              control={
                <Switch 
                  checked={useSecureRNG} 
                  onChange={(e) => setUseSecureRNG(e.target.checked)}
                />
              }
              label="Use Certified RNG"
            />
            
            <Button
              variant="contained"
              color="secondary"
              startIcon={<CasinoIcon />}
              onClick={handleGenerate}
              disabled={isGenerating}
              size="large"
            >
              {isGenerating ? 'Generating...' : 'Generate Numbers'}
            </Button>
          </Stack>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Typography variant="body2" color="text.secondary">
            {useSecureRNG
              ? 'Using NIST-certified RNG algorithm with cryptographic entropy seeding'
              : 'Using browser Math.random() - not recommended for production'}
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
};

export default AutoGeneratorPanel;