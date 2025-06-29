// src/components/layout/FilterBar.tsx
import { Box, } from '@mui/material';
import { Search } from '@mui/icons-material';
import { TextField } from '../ui/TextField';

interface FilterBarProps {
  searchPlaceholder?: string;
  filters?: React.ReactNode;
  actions?: React.ReactNode;
  onSearch?: (value: string) => void;
}

export const FilterBar = ({
  searchPlaceholder = 'Search...',
  filters,
  actions,
  onSearch
}: FilterBarProps) => (
  <Box sx={{ 
    display: 'flex', 
    flexDirection: { xs: 'column', sm: 'row' }, 
    gap: 2,
    mb: 2,
    alignItems: { sm: 'center' }
  }}>
    <TextField
      fullWidth
      variant="outlined"
      size="small"
      placeholder={searchPlaceholder}
      InputProps={{
        startAdornment: <Search fontSize="small" sx={{ mr: 1 }} />
      }}
      onChange={(e) => onSearch?.(e.target.value)}
      sx={{ maxWidth: { sm: 300 } }}
    />
    
    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
      {filters}
    </Box>
    
    <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
      {actions}
    </Box>
  </Box>
);