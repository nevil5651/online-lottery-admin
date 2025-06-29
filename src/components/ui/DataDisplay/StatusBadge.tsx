import { Badge,type BadgeProps, Box, Avatar, type AvatarProps } from '@mui/material';


interface StatusBadgeProps {
  status: 'active' | 'pending_kyc' | 'suspended' | 'banned';
  avatarUrl?: string;
  name: string;
  avatarProps?: AvatarProps;
  badgeProps?: BadgeProps;
}

export const StatusBadge = ({ 
  status, 
  avatarUrl, 
  name, 
  avatarProps, 
  badgeProps 
}: StatusBadgeProps) => (
  <Badge
    overlap="circular"
    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    badgeContent={
      <Box sx={{
        width: 12,
        height: 12,
        borderRadius: '50%',
        bgcolor: status === 'active' ? 'success.main' : 'error.main',
        border: '2px solid',
        borderColor: 'background.paper'
      }} />
    }
    {...badgeProps}
  >
    <Avatar 
      src={avatarUrl}
      sx={{ width: 36, height: 36, ...avatarProps?.sx }}
      {...avatarProps}
    >
      {name.charAt(0)}
    </Avatar>
  </Badge>
);