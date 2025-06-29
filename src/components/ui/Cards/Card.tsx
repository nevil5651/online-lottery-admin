// src/components/ui/Card.tsx
import { Card as MuiCard, CardContent } from '@mui/material';
import { styled } from '@mui/material/styles';

export const Card = styled(MuiCard)(({ theme }) => ({
  borderRadius: '12px',
  boxShadow: theme.shadows[2],
  transition: 'box-shadow 0.3s ease',
  '&:hover': {
    boxShadow: theme.shadows[3],
  },
}));

export const CardBody = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(3),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
}));