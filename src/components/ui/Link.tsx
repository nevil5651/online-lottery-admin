// src/components/ui/Link.tsx
import { Link as MuiLink } from '@mui/material';
import { styled } from '@mui/material/styles';

export const Link = styled(MuiLink)(({ theme }) => ({
  color: theme.palette.text.secondary,
  '&:hover': {
    color: theme.palette.primary.main,
    textDecoration: 'underline',
  },
  transition: 'all 0.2s ease',
}));