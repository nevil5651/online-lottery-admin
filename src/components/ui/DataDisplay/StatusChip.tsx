
import { Chip, type ChipProps } from '@mui/material';

type Status = 'active' | 'pending' | 'suspended' | 'banned';

interface StatusChipProps extends ChipProps {
  status: Status;
}

export const StatusChip = ({ status, ...props }: StatusChipProps) => {
  const getStatusColor = () => {
    switch(status) {
      case 'active': return 'success';
      case 'pending': return 'warning';
      default: return 'error';
    }
  };

  return (
    <Chip
      label={status}
      size="small"
      color={getStatusColor()}
      sx={{
        textTransform: 'capitalize',
        fontWeight: 500,
        ...props.sx
      }}
      {...props}
    />
  );
};