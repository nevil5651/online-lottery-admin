import { Chip, type ChipProps } from '@mui/material';
import type { DrawStatus } from '../../types/drawTypes';

const statusConfig: Record<DrawStatus, { label: string; color: ChipProps['color'] }> = {
  scheduled: { label: 'Scheduled', color: 'default' },
  open: { label: 'Open', color: 'success' },
  closed: { label: 'Closed', color: 'info' },
  completed: { label: 'Completed', color: 'primary' },
  cancelled: { label: 'Cancelled', color: 'error' },
};

interface StatusIndicatorProps {
  status: DrawStatus;
}

const StatusIndicator = ({ status }: StatusIndicatorProps) => {
  const config = statusConfig[status];
  
  return (
    <Chip 
      label={config.label} 
      color={config.color} 
      size="small" 
      variant="outlined"
    />
  );
};

export default StatusIndicator;