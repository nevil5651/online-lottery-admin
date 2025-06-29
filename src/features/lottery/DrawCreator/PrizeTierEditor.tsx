import { 
  Box, 
  Grid,  
  MenuItem, 
  IconButton 
} from '@mui/material';
import { 
  Button, 
  TextField, 
  Typography
} from '../../../components/ui';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import type { PrizeTier } from '../types';

interface PrizeTierEditorProps {
  prizes: PrizeTier[];
  onChange: (prizes: PrizeTier[]) => void;
  errors?: Record<string, string>;
}

export const PrizeTierEditor = ({ prizes, onChange, errors }: PrizeTierEditorProps) => {
  const handleAddTier = () => {
    onChange([
      ...prizes,
      {
        id: Date.now().toString(),
        name: '',
        description: '',
        value: 0,
        valueType: 'fixed',
        numberOfWinners: 1
      }
    ]);
  };

  const handleRemoveTier = (id: string) => {
    onChange(prizes.filter(tier => tier.id !== id));
  };

  const handleChange = (id: string, field: keyof PrizeTier, value: any) => {
    onChange(
      prizes.map(tier => 
        tier.id === id ? { ...tier, [field]: value } : tier
      )
    );
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Prize Distribution
      </Typography>
      
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={3}>
          <Typography variant="subtitle2">Tier Name</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography variant="subtitle2">Type</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography variant="subtitle2">Value</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography variant="subtitle2">Winners</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="subtitle2">Description</Typography>
        </Grid>
      </Grid>

      {prizes.map((tier, index) => (
        <Grid container key={tier.id} spacing={2} sx={{ mb: 2, alignItems: 'center' }}>
          <Grid item xs={3}>
            <TextField
              fullWidth
              value={tier.name}
              onChange={(e) => handleChange(tier.id, 'name', e.target.value)}
              placeholder="e.g., Jackpot"
              error={!!errors?.[`prizes[${index}].name`]}
              helperText={errors?.[`prizes[${index}].name`]}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              select
              fullWidth
              value={tier.valueType}
              onChange={(e) => handleChange(tier.id, 'valueType', e.target.value)}
            >
              <MenuItem value="fixed">Fixed</MenuItem>
              <MenuItem value="percentage">Percentage</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={2}>
            <TextField
              fullWidth
              type="number"
              value={tier.value}
              onChange={(e) => handleChange(tier.id, 'value', Number(e.target.value))}
              error={!!errors?.[`prizes[${index}].value`]}
              helperText={errors?.[`prizes[${index}].value`]}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              fullWidth
              type="number"
              value={tier.numberOfWinners}
              onChange={(e) => handleChange(tier.id, 'numberOfWinners', Number(e.target.value))}
              error={!!errors?.[`prizes[${index}].winners`]}
              helperText={errors?.[`prizes[${index}].winners`]}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              fullWidth
              value={tier.description}
              onChange={(e) => handleChange(tier.id, 'description', e.target.value)}
            />
          </Grid>
          <Grid item xs={1}>
            {prizes.length > 1 && (
              <IconButton onClick={() => handleRemoveTier(tier.id)}>
                <DeleteIcon color="error" />
              </IconButton>
            )}
          </Grid>
        </Grid>
      ))}

      <Box sx={{ mt: 2 }}>
        <Button 
          variant="outlined" 
          startIcon={<AddIcon />}
          onClick={handleAddTier}
        >
          Add Prize Tier
        </Button>
      </Box>

      {errors?.prizeTotal && (
        <Typography color="error" sx={{ mt: 1 }}>
          {errors.prizeTotal}
        </Typography>
      )}
    </Box>
  );
};