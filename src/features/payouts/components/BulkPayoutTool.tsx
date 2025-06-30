import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Checkbox,
  useTheme,
  TextField,
  Divider,
  Chip,
  Stack
} from '@mui/material';
import { usePayouts } from '../hooks/usePayouts';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { processBulkPayouts } from '../services/payoutService';
import { useAuth } from '../../../contexts/AuthContext';

const BulkPayoutTool = () => {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();
  const { payouts, loading, refresh, approvePayout } = usePayouts();
  const [selected, setSelected] = useState<string[]>([]);
  const [bulkProcessing, setBulkProcessing] = useState(false);
  const [notes, setNotes] = useState('');

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelected(event.target.checked ? payouts.map(p => p.id) : []);
  };

  const handleSelectOne = (id: string) => {
    setSelected(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleBulkApprove = async () => {
    if (!user || selected.length === 0) return;
    
    setBulkProcessing(true);
    try {
      await processBulkPayouts({
        payoutIds: selected,
        approvedBy: user.id,
        ipAddress: 'admin-panel', // Would be real IP in production
        userAgent: navigator.userAgent
      });
      enqueueSnackbar(`Successfully processed ${selected.length} payouts`, { variant: 'success' });
      setSelected([]);
      refresh();
    } catch (err) {
      enqueueSnackbar(
        (err && typeof err === 'object' && 'message' in err && typeof (err as any).message === 'string')
          ? (err as any).message
          : 'Bulk approval failed',
        { variant: 'error' }
      );
    } finally {
      setBulkProcessing(false);
    }
  };

  const totalAmount = payouts
    .filter(p => selected.includes(p.id))
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 4 }}>
      <Typography variant="h6" gutterBottom fontWeight="bold">
        Bulk Payout Processing
      </Typography>
      
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="body1" color="textSecondary">
          {selected.length} payouts selected (${totalAmount.toLocaleString()})
        </Typography>
        
        <Stack direction="row" spacing={2}>
          <Button 
            variant="outlined" 
            onClick={() => setSelected([])}
            disabled={selected.length === 0 || bulkProcessing}
          >
            Clear Selection
          </Button>
          
          <LoadingButton
            variant="contained"
            color="primary"
            onClick={handleBulkApprove}
            loading={bulkProcessing}
            disabled={selected.length === 0}
          >
            Approve Selected
          </LoadingButton>
        </Stack>
      </Box>

      <TextField
        label="Administrative Notes"
        placeholder="Add notes for this bulk operation"
        multiline
        rows={2}
        fullWidth
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        sx={{ mb: 3 }}
      />

      <Divider sx={{ my: 2 }} />

      <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ background: theme.palette.background.default }}>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selected.length === payouts.length && payouts.length > 0}
                  indeterminate={selected.length > 0 && selected.length < payouts.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>User</TableCell>
              <TableCell>Tier</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell>Method</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payouts.map(payout => (
              <TableRow key={payout.id} hover>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selected.includes(payout.id)}
                    onChange={() => handleSelectOne(payout.id)}
                  />
                </TableCell>
                <TableCell>{payout.username}</TableCell>
                <TableCell>
                  <Chip 
                    label={payout.tier} 
                    size="small"
                    color={
                      payout.tier === 'JACKPOT' ? 'primary' : 
                      payout.tier === 'SECOND' ? 'secondary' : 'default'
                    }
                  />
                </TableCell>
                <TableCell align="right">
                  ${payout.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </TableCell>
                <TableCell>{payout.method}</TableCell>
                <TableCell>
                  <Chip 
                    label={payout.status} 
                    size="small"
                    variant="outlined"
                    color={
                      payout.status === 'PENDING' ? 'default' :
                      payout.status === 'PROCESSING' ? 'info' :
                      payout.status === 'PAID' ? 'success' :
                      payout.status === 'FAILED' ? 'error' : 'warning'
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default BulkPayoutTool;