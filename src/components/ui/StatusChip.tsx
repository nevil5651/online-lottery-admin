// src/components/ui/StatusChip.tsx
import { Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';

type Status = 'active' | 'inactive' | 'pending' | 'banned' | 'suspended' | string;

interface StatusChipProps {
  status: Status;
  size?: 'small' | 'medium';
}

export const StatusChip = ({ status, size = 'medium' }: StatusChipProps) => {
  const theme = useTheme();
  
  const statusConfig = {
    active: {
      label: 'Active',
      color: theme.palette.success.main,
      bgColor: theme.palette.success.light
    },
    inactive: {
      label: 'Inactive',
      color: theme.palette.error.main,
      bgColor: theme.palette.error.light
    },
    pending: {
      label: 'Pending',
      color: theme.palette.warning.main,
      bgColor: theme.palette.warning.light
    },
    banned: {
      label: 'Banned',
      color: theme.palette.error.dark,
      bgColor: theme.palette.error.light
    },
    suspended: {
      label: 'Suspended',
      color: theme.palette.warning.dark,
      bgColor: theme.palette.warning.light
    }
  };

  const config = statusConfig[status as keyof typeof statusConfig] || {
    label: status.charAt(0).toUpperCase() + status.slice(1),
    color: theme.palette.text.secondary,
    bgColor: theme.palette.action.hover
  };

  return (
    <Chip
      label={config.label}
      size={size}
      sx={{
        backgroundColor: config.bgColor,
        color: config.color,
        fontWeight: 500,
        textTransform: 'capitalize',
        '& .MuiChip-label': {
          px: size === 'small' ? 0.5 : 1
        }
      }}
    />
  );
};