import React from 'react';
import { Button, type ButtonProps } from '@mui/material';

interface PrimaryButtonProps extends ButtonProps {
  children: React.ReactNode;
}

export const PrimaryButton = ({ children, ...props }: PrimaryButtonProps) => (
  <Button 
    variant="contained" 
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