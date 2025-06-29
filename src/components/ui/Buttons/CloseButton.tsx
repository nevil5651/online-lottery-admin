import { IconButton,type IconButtonProps } from '@mui/material';
import { Close } from '@mui/icons-material';

export const CloseButton = (props: IconButtonProps) => (
  <IconButton
    aria-label="close"
    sx={{
      position: 'absolute',
      right: 8,
      top: 8,
      color: (theme) => theme.palette.grey[500],
    }}
    {...props}
  >
    <Close />
  </IconButton>
);