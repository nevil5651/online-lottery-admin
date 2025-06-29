import React, { useState } from 'react';
import { 
  Modal, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Grid,
  CircularProgress,
  Alert
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import type { TransferPayload } from '../types/financeTypes';
import { initiateTransfer } from '../services/financeService';
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

interface TransferFormProps {
  open: boolean;
  onClose: () => void;
}

const TransferForm: React.FC<TransferFormProps> = ({ open, onClose }) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [confirmationNeeded, setConfirmationNeeded] = useState(false);
  const [transferData, setTransferData] = useState<TransferPayload | null>(null);

  const { control, handleSubmit, reset, watch } = useForm<TransferPayload>({
    defaultValues: {
      senderId: '',
      recipientId: '',
      amount: 0,
      currency: 'USD',
      reference: `TRF-${Date.now()}`,
    }
  });

  const amount = watch('amount') || 0;

  const onSubmit = async (data: TransferPayload) => {
    if (!user) return;
    
    // For large transfers, require confirmation
    if (amount > 1000 && !confirmationNeeded) {
      setTransferData(data);
      setConfirmationNeeded(true);
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Add admin ID to reference
      const payload = {
        ...data,
        reference: `${data.reference} (by ${user.name})`
      };
      
      await initiateTransfer(payload);
      setSuccess(true);
      setTimeout(() => {
        onClose();
        reset();
        setSuccess(false);
        setConfirmationNeeded(false);
      }, 1500);
    } catch (err) {
      setError('Failed to process transfer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmTransfer = () => {
    if (transferData) {
      onSubmit(transferData);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" gutterBottom>
          Transfer Funds Between Users
        </Typography>
        
        {success ? (
          <Box textAlign="center" py={4}>
            <Typography color="success.main" variant="h6">
              Transfer Successful!
            </Typography>
          </Box>
        ) : confirmationNeeded ? (
          <Box>
            <Alert severity="warning" sx={{ mb: 2 }}>
              You are about to transfer {formatCurrency(amount)} between accounts. 
              Please confirm this action.
            </Alert>
            
            <Typography variant="body1" gutterBottom>
              <strong>From:</strong> {transferData?.senderId}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>To:</strong> {transferData?.recipientId}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Reference:</strong> {transferData?.reference}
            </Typography>
            
            <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
              <Button 
                variant="outlined" 
                onClick={() => setConfirmationNeeded(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="contained" 
                color="primary"
                onClick={handleConfirmTransfer}
                disabled={isSubmitting}
              >
                {isSubmitting ? <CircularProgress size={24} /> : 'Confirm Transfer'}
              </Button>
            </Box>
          </Box>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="senderId"
                  control={control}
                  rules={{ required: 'Sender ID is required' }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="Sender User ID"
                      fullWidth
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Controller
                  name="recipientId"
                  control={control}
                  rules={{ required: 'Recipient ID is required' }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="Recipient User ID"
                      fullWidth
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
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
                  name="currency"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Currency"
                      fullWidth
                      disabled
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
                  {isSubmitting ? <CircularProgress size={24} /> : 'Initiate Transfer'}
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      </Box>
    </Modal>
  );
};

export default TransferForm;