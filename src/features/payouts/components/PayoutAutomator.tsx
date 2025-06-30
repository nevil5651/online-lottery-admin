import { 
  Box, 
  Typography, 
  Switch, 
  FormControlLabel,
  Divider,
  Paper,
  Stack,
  TextField,
  useTheme
} from '@mui/material';
import { usePayoutRules } from '../hooks/usePayoutRules';
import type { PayoutRule } from '../types/payoutTypes';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { useState } from 'react';

const PayoutAutomator = () => {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const { rules, loading, toggleRuleStatus, updateRules } = usePayoutRules();
  const [editMode, setEditMode] = useState<Record<string, Partial<PayoutRule>>>({});

  const handleToggle = async (ruleId: string) => {
    const success = await toggleRuleStatus(ruleId);
    if (success) {
      enqueueSnackbar('Rule updated successfully', { variant: 'success' });
    }
  };

  const handleEditField = (ruleId: string, field: keyof PayoutRule, value: any) => {
    setEditMode(prev => ({
      ...prev,
      [ruleId]: {
        ...prev[ruleId],
        [field]: value
      }
    }));
  };

  const saveChanges = async () => {
    const updates = Object.entries(editMode).map(([id, changes]) => ({ id, ...changes }));
    const success = await updateRules(updates);
    if (success) {
      setEditMode({});
      enqueueSnackbar('Rules saved successfully', { variant: 'success' });
    }
  };

  const hasChanges = Object.keys(editMode).length > 0;

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6" fontWeight="bold">
          Payout Automation Rules
        </Typography>
        {hasChanges && (
          <LoadingButton
            variant="contained"
            onClick={saveChanges}
            loading={loading}
          >
            Save Changes
          </LoadingButton>
        )}
      </Box>

      {loading && !rules.length ? (
        <Typography>Loading rules...</Typography>
      ) : (
        <Stack spacing={3}>
          {rules.map(rule => (
            <Paper key={rule.id} elevation={0} sx={{ 
              p: 3, 
              borderRadius: 3,
              border: `1px solid ${theme.palette.divider}`
            }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle1" fontWeight="bold">
                  {rule.tier} Prize Tier
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={rule.autoApprove}
                      onChange={() => handleToggle(rule.id)}
                      color="primary"
                    />
                  }
                  label={rule.autoApprove ? 'Auto-Approved' : 'Manual Approval'}
                  labelPlacement="start"
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={3}>
                <TextField
                  label="Minimum Amount"
                  type="number"
                  value={editMode[rule.id]?.minAmount ?? rule.minAmount}
                  onChange={(e) => handleEditField(rule.id, 'minAmount', parseFloat(e.target.value))}
                  InputProps={{ startAdornment: '$' }}
                  fullWidth
                />

                <TextField
                  label="Maximum Amount"
                  type="number"
                  value={editMode[rule.id]?.maxAmount ?? rule.maxAmount ?? ''}
                  onChange={(e) => handleEditField(rule.id, 'maxAmount', e.target.value ? parseFloat(e.target.value) : null)}
                  InputProps={{ startAdornment: '$' }}
                  fullWidth
                />

                <TextField
                  label="Payment Method"
                  select
                  SelectProps={{ native: true }}
                  value={editMode[rule.id]?.paymentMethod ?? rule.paymentMethod}
                  onChange={(e) => handleEditField(rule.id, 'paymentMethod', e.target.value)}
                  fullWidth
                >
                  <option value="WALLET">Wallet</option>
                  <option value="BANK">Bank Transfer</option>
                  <option value="CRYPTO">Crypto</option>
                  <option value="CHECK">Check</option>
                </TextField>

                <FormControlLabel
                  control={
                    <Switch
                      checked={editMode[rule.id]?.requiresTaxForm ?? rule.requiresTaxForm}
                      onChange={(e) => handleEditField(rule.id, 'requiresTaxForm', e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Requires Tax Form"
                />
              </Box>
            </Paper>
          ))}
        </Stack>
      )}
    </Paper>
  );
};

export default PayoutAutomator;