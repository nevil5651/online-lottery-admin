// src/components/ui/TextField.tsx
import { TextField as MuiTextField } from '@mui/material';
import { styled } from '@mui/material/styles';

export const TextField = styled(MuiTextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    '&.Mui-focused fieldset': {
      borderWidth: '2px',
    },
  },
  '& .MuiInputLabel-root': {
    color: theme.palette.text.secondary,
  },
}));