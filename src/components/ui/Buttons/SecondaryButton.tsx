import React from 'react';
import { Button, type ButtonProps } from '@mui/material';

interface SecondaryButtonProps extends ButtonProps {
  children: React.ReactNode;
}

export const SecondaryButton = ({ children, ...props }: SecondaryButtonProps) => (
  <Button 
    variant="outlined" 
    color="primary"
    size="small"
    sx={{
      textTransform: 'none',
      fontWeight: 500,
      borderRadius: 1,
      ...props.sx
    }}
    {...props}
  >
    {children}
  </Button>
);