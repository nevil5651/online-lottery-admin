import React, { useState } from 'react';
import { 
  Modal, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Select, 
  Grid,
  CircularProgress
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import type { AdjustmentPayload } from '../types/financeTypes';
import { adjustBalance } from '../services/financeService';
import { useAuth } from '../../../contexts/AuthContext';
import { formatCurrency } from '../../../utils/formatters';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

interface AdjustmentModalProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  currentBalance?: number;
}

const AdjustmentModal: React.FC<AdjustmentModalProps> = ({ 
  open, 
  onClose, 
  userId,
  currentBalance = 0 
}) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { control, handleSubmit, reset, watch } = useForm<AdjustmentPayload>({
    defaultValues: {
      userId,
      amount: 0,
      type: 'CREDIT',
      reason: 'OTHER',
      reference: `ADJ-${Date.now()}`,
    }
  });

  const adjustmentType = watch('type');

  const onSubmit = async (data: AdjustmentPayload) => {
    if (!user) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Add admin ID to payload
      const payload = {
        ...data,
        adminId: user.id,
        notes: `Manual adjustment by ${user.name} (${user.email})`
      };
      
      await adjustBalance(payload);
      setSuccess(true);
      setTimeout(() => {
        onClose();
        reset();
        setSuccess(false);
      }, 1500);
    } catch (err) {
      setError('Failed to process adjustment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateNewBalance = () => {
    const amount = watch('amount') || 0;
    return adjustmentType === 'CREDIT' 
      ? currentBalance + amount 
      : Math.max(0, currentBalance - amount);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" gutterBottom>
          Manual Balance Adjustment
        </Typography>
        
        {success ? (
          <Box textAlign="center" py={4}>
            <Typography color="success.main" variant="h6">
              Adjustment Successful!
            </Typography>
          </Box>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography>
                  User ID: <strong>{userId}</strong>
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Adjustment Type</InputLabel>
                      <Select {...field} label="Adjustment Type">
                        <MenuItem value="CREDIT">Credit</MenuItem>
                        <MenuItem value="DEBIT">Debit</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Controller
                  name="reason"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Reason</InputLabel>
                      <Select {...field} label="Reason">
                        <MenuItem value="COMPENSATION">Compensation</MenuItem>
                        <MenuItem value="FRAUD">Fraud Correction</MenuItem>
                        <MenuItem value="ERROR_CORRECTION">Error Correction</MenuItem>
                        <MenuItem value="BONUS">Bonus</MenuItem>
                        <MenuItem value="OTHER">Other</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Controller
                  name="amount"
                  control={control}
                  rules={{ 
                    required: 'Amount is required',
                    min: { value: 0.01, message: 'Amount must be greater than 0' }
                  }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="Amount"
                      type="number"
                      fullWidth
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      inputProps={{ step: "0.01", min: "0.01" }}
                    />
                  )}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Controller
                  name="reference"
                  control={control}
                  rules={{ required: 'Reference is required' }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="Reference"
                      fullWidth
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="body2">
                  Current Balance: {formatCurrency(currentBalance)}
                </Typography>
                <Typography variant="body2">
                  New Balance: {formatCurrency(calculateNewBalance())}
                </Typography>
              </Grid>
              
              {error && (
                <Grid item xs={12}>
                  <Typography color="error">{error}</Typography>
                </Grid>
              )}
              
              <Grid item xs={12} display="flex" justifyContent="flex-end" gap={2}>
                <Button 
                  variant="outlined" 
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <CircularProgress size={24} /> : 'Apply Adjustment'}
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      </Box>
    </Modal>
  );
};

export default AdjustmentModal;