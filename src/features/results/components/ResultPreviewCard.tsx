import { 
  CardContent,  
  Stack, 
  Chip,
  Box
} from '@mui/material';
import { Typography,
  Card } from '../../../components/ui';  
import StatusChip from './StatusChip';
import type { GameType } from '../types/resultTypes';

interface ResultPreviewCardProps {
  results: number[];
  gameType: GameType;
}

const ResultPreviewCard = ({ results, gameType }: ResultPreviewCardProps) => {
  const formatResults = () => {
    if (gameType === 'raffle') {
      return results.map(id => `Ticket #${id}`).join(', ');
    }
    
    return results.join(' - ');
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Result Preview</Typography>
          <StatusChip status="draft" />
        </Stack>
        
        <Box sx={{ 
          bgcolor: 'grey.100', 
          p: 3, 
          mt: 2,
          borderRadius: 1,
          textAlign: 'center'
        }}>
          <Typography variant="h4" component="div">
            {formatResults()}
          </Typography>
          
          {gameType === 'powerball' && results.length > 0 && (
            <Chip 
              label={`Powerball: ${results[results.length - 1]}`} 
              color="error" 
              sx={{ mt: 2, fontSize: '1.25rem' }}
            />
          )}
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          {results.length ? 'Preview will be verified before submission' : 'No results generated'}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ResultPreviewCard;