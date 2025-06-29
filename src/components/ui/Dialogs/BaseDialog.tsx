import { Dialog, type DialogProps } from '@mui/material';

interface BaseDialogProps extends DialogProps {
  open: boolean;
  onClose: () => void;
}

export const BaseDialog = ({ open, onClose, ...props }: BaseDialogProps) => (
  <Dialog 
    open={open} 
    onClose={onClose} 
    fullWidth 
    maxWidth="sm"
    {...props}
  />
);