import { Chip, type ChipProps } from '@mui/material';
import type { ResultStatus } from '../types/resultTypes';

const statusConfig: Record<ResultStatus, { label: string; color: ChipProps['color'] }> = {
  draft: { label: 'Draft', color: 'default' },
  pending_approval: { label: 'Pending Approval', color: 'warning' },
  published: { label: 'Published', color: 'success' },
  locked: { label: 'Locked', color: 'info' }
};

interface StatusChipProps {
  status: ResultStatus;
}

const StatusChip = ({ status }: StatusChipProps) => {
  const config = statusConfig[status];
  
  return (
    <Chip 
      label={config.label} 
      color={config.color} 
      size="medium"
      variant="outlined"
      sx={{ 
        fontWeight: 'bold',
        px: 1,
        borderRadius: 1
      }}
    />
  );
};

export default StatusChip;