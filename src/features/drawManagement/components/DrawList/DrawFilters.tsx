import React from 'react';
import { 
  Box, 
  MenuItem, 
  InputAdornment,
  Stack,
} from '@mui/material';
import {Button, TextField, } from '../../../../components/ui';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';

import { FilterList, Clear } from '@mui/icons-material';
import type { DrawFilters, DrawStatus, DrawType } from '../../types/drawTypes';

interface DrawFiltersProps {
  onFilterChange: (filters: DrawFilters) => void;
}

const statusOptions: DrawStatus[] = ['scheduled', 'open', 'closed', 'completed', 'cancelled'];
const typeOptions: DrawType[] = ['daily', 'weekly', 'special', 'pick3', 'pick4', 'pick6', 'raffle'];

const DrawFiltersComponent  = ({ onFilterChange }: DrawFiltersProps) => {
  const [filters, setFilters] = React.useState<DrawFilters>({});
  
  const handleChange = (field: keyof DrawFilters, value: any) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  const handleClear = () => {
    const clearedFilters = {};
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <Box component="form" noValidate autoComplete="off">
      <Stack direction="row" spacing={2} alignItems="center">
        <TextField
          select
          label="Status"
          value={filters.status || ''}
          onChange={(e) => handleChange('status', e.target.value)}
          sx={{ minWidth: 150 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FilterList fontSize="small" />
              </InputAdornment>
            ),
          }}
        >
          <MenuItem value="">All Statuses</MenuItem>
          {statusOptions.map((status) => (
            <MenuItem key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Type"
          value={filters.type || ''}
          onChange={(e) => handleChange('type', e.target.value)}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">All Types</MenuItem>
          {typeOptions.map((type) => (
            <MenuItem key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </MenuItem>
          ))}
        </TextField>
        <DatePicker
          label="From Date"
          value={filters.startDate ? dayjs(filters.startDate) : null}
          onChange={(date: Dayjs | null) => handleChange('startDate', date ? date.toDate() : null)}
          slotProps={{ textField: { sx: { minWidth: 180 } } }}
        />

        <DatePicker
          label="To Date"
          value={filters.endDate ? dayjs(filters.endDate) : null}
          onChange={(date: Dayjs | null) => handleChange('endDate', date ? date.toDate() : null)}
          slotProps={{ textField: { sx: { minWidth: 180 } } }}
        />
        

        <TextField
          label="Search"
          variant="outlined"
          value={filters.search || ''}
          onChange={(e) => handleChange('search', e.target.value)}
          sx={{ flexGrow: 1 }}
        />

        <Button
          variant="outlined"
          //startIcon={<Clear />}
          onClick={handleClear}
        >
          Clear
        </Button>
      </Stack>
    </Box>
  );
};

export default DrawFiltersComponent ;