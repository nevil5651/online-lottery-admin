import { Snackbar, Box, Typography } from '@mui/material';


interface CustomSnackbarProps {
  open: boolean;
  message: string;
  severity: 'success' | 'error';
  onClose: () => void;
}

export const CustomSnackbar = ({ 
  open, 
  message, 
  severity, 
  onClose 
}: CustomSnackbarProps) => (
  <Snackbar
    open={open}
    autoHideDuration={5000}
    onClose={onClose}
    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
  >
    <Box 
      sx={{
        backgroundColor: severity === 'error' ? 'error.main' : 'success.main',
        color: 'common.white',
        p: 1,
        borderRadius: 1,
        maxWidth: '90vw'
      }}
    >
      <Typography variant="body2">{message}</Typography>
    </Box>
  </Snackbar>
);