import { useState } from 'react';
import {
  DataGrid,
  type GridColDef,
  type GridRowParams,
  type GridRowSelectionModel,
} from '@mui/x-data-grid';
import ErrorBoundary from './ErrorBoundary';
import {
  Typography,
  Chip,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Tooltip,
  IconButton,
  Paper,
  Stack,
  useTheme,
  Badge,
  LinearProgress
} from '@mui/material';
import {
  CheckCircleOutline as ApproveIcon,
  HighlightOff as RejectIcon,
  ReceiptLong as DetailsIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  ErrorOutline as HighValueIcon
} from '@mui/icons-material';
import { usePayouts } from '../hooks/usePayouts';
import type { Payout } from '../types/payoutTypes';
import { format } from 'date-fns';
import { useAuth } from '../../../contexts/AuthContext';
import { useSnackbar } from 'notistack';

const PayoutApproval = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const {
    payouts,
    loading,
    approvePayout,
    rejectPayout,
    refresh,
    updateFilters,
    summary
  } = usePayouts({ status: ['PENDING', 'PROCESSING'] });
  
  const [selectedPayout, setSelectedPayout] = useState<Payout | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([] as unknown as GridRowSelectionModel);
  const [requiresDualApproval, setRequiresDualApproval] = useState(false);

  // Ensure all payout IDs are strings
  const rows = payouts.map(payout => ({
    ...payout,
    id: String(payout.id) // Convert to string if needed
  }));

  const handleRejectClick = (id: string) => {
    const payout = payouts.find(p => p.id === id);
    if (payout) {
      setSelectedPayout(payout);
      setRejectDialogOpen(true);
    }
  };

  const handleConfirmReject = () => {
    if (selectedPayout && rejectionReason.trim()) {
      rejectPayout(selectedPayout.id, rejectionReason);
      setRejectDialogOpen(false);
      setRejectionReason('');
    }
  };

  const handleBulkApprove = async () => {
    if (!user) return;
    
    const highValuePayouts = rows.filter(p => 
      (selectionModel as unknown as (string | number)[]).includes(p.id) && p.amount > 10000
    );
    
    if (highValuePayouts.length > 0) {
      setRequiresDualApproval(true);
      return;
    }

    try {
      await Promise.all(
        (selectionModel as unknown as (string | number)[]).map(id => approvePayout(id.toString()))
      );
      enqueueSnackbar(`Approved ${(selectionModel as unknown as (string | number)[]).length} payouts`, { variant: 'success' });
      setSelectionModel([] as unknown as GridRowSelectionModel);
    } catch (error) {
      enqueueSnackbar(
        (error instanceof Error && error.message) ? error.message : 'Approval failed',
        { variant: 'error' }
      );
    }
  };

  const columns: GridColDef[] = [
    { 
      field: 'username', 
      headerName: 'USER', 
      width: 150,
      renderCell: (params) => (
        <Typography fontWeight="medium">{params.value}</Typography>
      )
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
      headerAlign: 'right',
      align: 'right',
      valueFormatter: (params: { value: number }) => `$${params.value.toLocaleString()}`,
      renderCell: (params) => (
        <Stack direction="row" alignItems="center" spacing={0.5}>
          {params.row.amount > 10000 && (
            <Tooltip title="High-value payout requires dual approval">
              <HighValueIcon color="warning" fontSize="small" />
            </Tooltip>
          )}
          <Typography fontWeight="bold">
            ${params.value.toLocaleString()}
          </Typography>
        </Stack>
      )
    },
    { 
      field: 'netAmount', 
      headerName: 'NET', 
      width: 120,
      type: 'number',
      headerAlign: 'right',
      align: 'right',
      valueFormatter: (params: { value: number }) => `$${params.value.toLocaleString()}`
    },
    { 
      field: 'method', 
      headerName: 'METHOD', 
      width: 130,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          size="small" 
          variant="outlined"
        />
      )
    },
    { 
      field: 'createdAt', 
      headerName: 'DATE', 
      width: 180,
      valueFormatter: (params: { value: string | number | Date }) => 
        format(new Date(params.value), 'PPpp')
    },
    {
      field: 'actions',
      headerName: 'ACTIONS',
      width: 150,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="Approve payout">
            <IconButton
              onClick={() => params.row.amount > 10000 ? 
                setRequiresDualApproval(true) : 
                approvePayout(params.row.id.toString())
              }
              disabled={params.row.status !== 'PENDING'}
              size="small"
            >
              <ApproveIcon color={params.row.amount > 10000 ? 'disabled' : 'success'} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Reject payout">
            <IconButton
              onClick={() => handleRejectClick(params.row.id.toString())}
              disabled={params.row.status !== 'PENDING'}
              size="small"
            >
              <RejectIcon color="error" />
            </IconButton>
          </Tooltip>
          <Tooltip title="View details">
            <IconButton
              onClick={() => window.open(`/payouts/${params.row.id}`, '_blank')}
              size="small"
            >
              <DetailsIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      )
    }
  ];

  const CustomToolbar = () => (
    <Stack 
      direction="row" 
      spacing={2} 
      alignItems="center" 
      p={2}
      borderBottom={`1px solid ${theme.palette.divider}`}
      width="100%"
    >
      <Typography variant="h6" fontWeight="bold" flexGrow={1}>
        Pending Approvals
        {summary && (
          <Typography variant="body2" color="text.secondary">
            {summary.pendingCount} payouts requiring action
          </Typography>
        )}
      </Typography>
      
      <Button
        variant="outlined"
        startIcon={<FilterIcon />}
        onClick={() => updateFilters({ method: ['WALLET', 'BANK'] })}
      >
        Filter
      </Button>
      
      <IconButton onClick={refresh} disabled={loading}>
        <RefreshIcon />
      </IconButton>
      
      <Badge badgeContent={Array.isArray(selectionModel) ? selectionModel.length : 0} color="primary">
        <Button
          variant="contained"
          startIcon={<ApproveIcon />}
          onClick={handleBulkApprove}
          disabled={!(Array.isArray(selectionModel) && selectionModel.length > 0) || loading}
        >
          Approve Selected
        </Button>
      </Badge>
    </Stack>
  );

  const CustomFooter = () => (
    <Stack 
      direction="row" 
      justifyContent="space-between" 
      alignItems="center"
      p={2}
      borderTop={`1px solid ${theme.palette.divider}`}
      width="100%"
    >
      <Typography variant="body2">
        {Array.isArray(selectionModel) ? selectionModel.length : 0} selected
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Last updated: {format(new Date(), 'PPpp')}
      </Typography>
    </Stack>
  );

  const getRowClassName = (params: GridRowParams) => {
    return params.row.amount > 10000 ? 'high-value-row' : '';
  };

  return (
    <>
      <Paper elevation={4} sx={{ 
        height: 'calc(100vh - 200px)',
        borderRadius: 4,
        overflow: 'hidden',
        border: `1px solid ${theme.palette.divider}`,
        '& .high-value-row': {
          background: `${theme.palette.warning.light}20`
        }
      }}>
        <ErrorBoundary 
          fallback={
            <div style={{ padding: 16, textAlign: 'center' }}>
              <Typography color="error" variant="h6">
                Payout table failed to load
              </Typography>
              <Button 
                variant="contained" 
                onClick={() => window.location.reload()}
                sx={{ mt: 2 }}
              >
                Reload Page
              </Button>
            </div>
          }
        >
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          checkboxSelection
          disableRowSelectionOnClick
          disableColumnMenu
          rowHeight={60}
          rowSelectionModel={selectionModel}
  onRowSelectionModelChange={(newSelectionModel: GridRowSelectionModel) => 
    setSelectionModel(newSelectionModel)
  }
          slots={{
            toolbar: CustomToolbar,
            footer: CustomFooter,
            loadingOverlay: () => (
              <Stack sx={{ width: '100%', py: 2 }}>
                <LinearProgress color="primary" />
              </Stack>
            )
          }}
          getRowClassName={getRowClassName}
          sx={{
            '& .MuiDataGrid-columnHeaders': {
              background: theme.palette.background.default,
              borderRadius: 0
            },
            '& .MuiDataGrid-cell': {
              borderBottom: `1px solid ${theme.palette.divider}`
            },
            '& .MuiDataGrid-checkboxInput': {
              color: theme.palette.primary.main,
            }
          }}
        />
        </ErrorBoundary>
      </Paper>

      <Dialog 
        open={rejectDialogOpen} 
        onClose={() => setRejectDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Reject Payout
          {selectedPayout && (
            <Typography variant="body2" color="text.secondary">
              {selectedPayout.username} • ${selectedPayout.amount.toLocaleString()}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Reason for rejection"
            placeholder="Enter detailed reason for rejection..."
            type="text"
            fullWidth
            variant="outlined"
            multiline
            minRows={3}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleConfirmReject} 
            color="error"
            variant="contained"
            disabled={!rejectionReason.trim()}
          >
            Confirm Rejection
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={requiresDualApproval}
        onClose={() => setRequiresDualApproval(false)}
      >
        <DialogTitle>Dual Approval Required</DialogTitle>
        <DialogContent>
          <Typography>
            One or more selected payouts exceed $10,000 and require secondary approval.
            Please initiate the dual approval workflow through the compliance dashboard.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRequiresDualApproval(false)}>Understood</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PayoutApproval;