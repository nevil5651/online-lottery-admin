import React from 'react';
import { 
  Grid,
  InputAdornment
} from '@mui/material';
import { TextField, Typography } from '../../../components/ui';
import type { GameType } from '../types/resultTypes';
import { useResultValidation } from '../hooks/useResultValidation';

interface ManualEntryFormProps {
   gameType: GameType;
  onResultsChange: (numbers: number[]) => void;
  initialValues?: number[];
  disabled?: boolean;
}

const getNumberCount = (type: GameType): number => {
  switch(type) {
    case 'pick3': return 3;
    case 'pick4': return 4;
    case 'pick6': return 6;
    case 'powerball': return 7;
    default: return 0;
  }
};

const ManualEntryForm = ({ gameType, onResultsChange,
  initialValues, disabled = false
}: ManualEntryFormProps) => {
  const numberCount = getNumberCount(gameType);
  const [values, setValues] = React.useState<number[]>(Array(numberCount).fill(0));
  const { validate, errors } = useResultValidation();
  
  const handleChange = (index: number, value: string) => {
    const numValue = parseInt(value) || 0;
    const newValues = [...values];
    newValues[index] = numValue;
    setValues(newValues);
    onResultsChange(newValues);
    
    // Validate on change
    validate(newValues, gameType);
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Enter Winning Numbers
      </Typography>
      
      <Grid container spacing={2}>
        {Array.from({ length: numberCount }).map((_, index) => (
          <Grid item xs={4} sm={3} md={2} key={index}>
            <TextField
              fullWidth
              label={`Number ${index + 1}`}
              type="number"
              value={values[index]}
              onChange={(e) => handleChange(index, e.target.value)}
              error={!!errors[index]}
              helperText={errors[index]}
              InputProps={{
                inputProps: { 
                  min: 1, 
                  max: gameType === 'powerball' && index === numberCount - 1 ? 20 : 99 
                },
                endAdornment: gameType === 'powerball' && index === numberCount - 1 ? (
                  <InputAdornment position="end">PB</InputAdornment>
                ) : null
              }}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default ManualEntryForm;