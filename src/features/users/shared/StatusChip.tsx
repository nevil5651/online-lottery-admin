import { Chip, useTheme } from '@mui/material';
import type { UserStatus } from '../UserTypes';

interface StatusChipProps {
  status: UserStatus;
}

export const StatusChip = ({ status }: StatusChipProps) => {
  const theme = useTheme();
  
  const statusConfig = {
    active: { label: 'Active', color: theme.palette.success.main },
    pending_kyc: { label: 'Pending KYC', color: theme.palette.warning.main },
    suspended: { label: 'Suspended', color: theme.palette.error.light },
    banned: { label: 'Banned', color: theme.palette.error.dark }
  };
  
  return (
    <Chip
      label={statusConfig[status].label}
      size="small"
      sx={{ 
        backgroundColor: statusConfig[status].color,
        color: theme.palette.common.white,
        fontWeight: 500,
        textTransform: 'capitalize'
      }}
    />
  );
};