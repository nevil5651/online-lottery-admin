import React, { useState } from 'react';
import { 
  DataGrid, 
  type GridColDef, 
  GridToolbarContainer,
  GridToolbarExport,
  GridFooterContainer
} from '@mui/x-data-grid';
import { 
  
  Typography, 
  Paper, 
  Button, 
  Stack, 
  TextField,
  useTheme,
  IconButton,
  Chip
} from '@mui/material';
import { Refresh, FilterList } from '@mui/icons-material';
import { usePayouts } from '../hooks/usePayouts';
//import type { Payout } from '../types/payoutTypes';
import { format } from 'date-fns';

const PayoutHistory = () => {
  const theme = useTheme();
  const { payouts, loading, refresh, updateFilters } = usePayouts({
    status: ['PAID', 'FAILED', 'REVERSED']
  });
  const [dateRange, setDateRange] = useState<[string | null, string | null]>([null, null]);

  const handleDateChange = (index: 0 | 1) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRange = [...dateRange] as [string | null, string | null];
    newRange[index] = e.target.value;
    setDateRange(newRange);
    
    if (newRange[0] && newRange[1]) {
      updateFilters({ dateRange: [newRange[0], newRange[1]] });
    }
  };

  const clearFilters = () => {
    setDateRange([null, null]);
    updateFilters({ dateRange: undefined });
  };

  const columns: GridColDef[] = [
    { 
      field: 'id', 
      headerName: 'ID', 
      width: 100,
      renderCell: (params) => (
        <Typography variant="body2" fontFamily="monospace">
          {params.value.slice(0, 8)}
        </Typography>
      )
    },
    { 
      field: 'username', 
      headerName: 'USER', 
      width: 150 
    },
    { 
      field: 'tier', 
      headerName: 'TIER', 
      width: 120,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          size="small"
          color={
            params.value === 'JACKPOT' ? 'primary' : 
            params.value === 'SECOND' ? 'secondary' : 'default'
          }
        />
      )
    },
    { 
      field: 'amount', 
      headerName: 'AMOUNT', 
      width: 130,
      type: 'number',
      valueFormatter: (params: { value: number }) => `$${params.value.toLocaleString()}`,
      renderCell: (params) => (
        <Typography fontWeight="medium">
          ${params.value.toLocaleString()}
        </Typography>
      )
    },
    { 
      field: 'method', 
      headerName: 'METHOD', 
      width: 120 
    },
    { 
      field: 'status', 
      headerName: 'STATUS', 
      width: 120,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          size="small"
          color={
            params.value === 'PAID' ? 'success' :
            params.value === 'FAILED' ? 'error' : 'warning'
          }
          variant="outlined"
        />
      )
    },
    { 
      field: 'createdAt', 
      headerName: 'CREATED', 
      width: 180,
      valueFormatter: (params: { value: string }) => format(new Date(params.value), 'PPpp')
    },
    { 
      field: 'updatedAt', 
      headerName: 'UPDATED', 
      width: 180,
      valueFormatter: (params: { value: string }) => params.value ? format(new Date(params.value), 'PPpp') : '-'
    },
    { 
      field: 'referenceId', 
      headerName: 'REFERENCE', 
      width: 180,
      renderCell: (params) => params.value || '-'
    }
  ];

  const CustomToolbar = () => (
    <GridToolbarContainer sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
      <Stack direction="row" spacing={2} alignItems="center" width="100%">
        <Typography variant="h6" fontWeight="bold" flexGrow={1}>
          Payout History
        </Typography>
        
        <Stack direction="row" spacing={1} alignItems="center">
          <TextField
            label="From"
            type="date"
            size="small"
            InputLabelProps={{ shrink: true }}
            sx={{ width: 150 }}
            value={dateRange[0] || ''}
            onChange={handleDateChange(0)}
          />
          <TextField
            label="To"
            type="date"
            size="small"
            InputLabelProps={{ shrink: true }}
            sx={{ width: 150 }}
            value={dateRange[1] || ''}
            onChange={handleDateChange(1)}
          />
          <Button 
            variant="outlined" 
            startIcon={<FilterList />}
            onClick={clearFilters}
          >
            Clear
          </Button>
        </Stack>
        
        <IconButton onClick={refresh} disabled={loading}>
          <Refresh />
        </IconButton>
        
        <GridToolbarExport 
          printOptions={{ disableToolbarButton: true }} 
          csvOptions={{ 
            fileName: `payouts-history-${format(new Date(), 'yyyy-MM-dd')}`,
            delimiter: ',',
            utf8WithBom: true
          }} 
        />
      </Stack>
    </GridToolbarContainer>
  );

  const CustomFooter = () => (
    <GridFooterContainer sx={{ 
      p: 2, 
      borderTop: `1px solid ${theme.palette.divider}`,
      justifyContent: 'flex-end'
    }}>
      <Typography variant="body2" color="textSecondary">
        Showing {payouts.length} records
      </Typography>
    </GridFooterContainer>
  );

  return (
    <Paper elevation={0} sx={{ 
      height: 'calc(100vh - 300px)', 
      borderRadius: 4,
      overflow: 'hidden',
      border: `1px solid ${theme.palette.divider}`
    }}>
      <DataGrid
        rows={payouts}
        columns={columns}
        loading={loading}
        checkboxSelection
        disableRowSelectionOnClick
        slots={{
          toolbar: CustomToolbar,
          footer: CustomFooter
        }}
        sx={{
          '& .MuiDataGrid-columnHeaders': {
            background: theme.palette.background.default,
            borderRadius: 0
          },
          '& .MuiDataGrid-cell': {
            borderBottom: `1px solid ${theme.palette.divider}`
          }
        }}
      />
    </Paper>
  );
};

export default PayoutHistory;