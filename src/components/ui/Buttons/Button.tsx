// src/components/ui/Button.tsx
import { Button as MuiButton, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledButton = styled(MuiButton)(({ theme, size = 'medium' }) => ({
  height: size === 'medium' ? '44px' : size === 'large' ? '48px' : '36px',
  borderRadius: theme.shape.borderRadius,
  textTransform: 'none',
  fontWeight: 500,
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: theme.shadows[2],
  },
}));

interface ButtonProps extends React.ComponentProps<typeof MuiButton> {
  loading?: boolean;
}

export const Button = ({ children, loading, ...props }: ButtonProps) => {
  return (
    <StyledButton {...props}>
      {loading ? <CircularProgress size={24} color="inherit" /> : children}
    </StyledButton>
  );
};