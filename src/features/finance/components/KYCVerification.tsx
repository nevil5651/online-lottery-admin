import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  Box, 
  Typography, 
  Button, 
  Grid,
  CircularProgress,
  Alert,
  Chip,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import { useAuth } from '../../../contexts/AuthContext';
import { getKYCStatus, updateKYCStatus } from '../services/financeService';
import type { KYCStatus } from '../types/financeTypes';
import { formatDateTime } from '../../../utils/formatters';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  maxHeight: '90vh',
  overflowY: 'auto',
};

interface KYCVerificationProps {
  open: boolean;
  onClose: () => void;
  userId: string;
}

const KYCVerification: React.FC<KYCVerificationProps> = ({ open, onClose, userId }) => {
  const { user } = useAuth();
  const [kycData, setKycData] = useState<KYCStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (open && userId) {
      fetchKYCStatus();
    }
  }, [open, userId]);

  const fetchKYCStatus = async () => {
    setLoading(true);
    try {
      const data = await getKYCStatus(userId);
      setKycData(data);
      setNotes(data.adminNotes || '');
    } catch (err) {
      setError('Failed to fetch KYC status');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!user || !kycData) return;
    
    setIsUpdating(true);
    setError(null);
    
    try {
      await updateKYCStatus(userId, 'APPROVED', notes);
      setSuccess(true);
      setTimeout(() => {
        fetchKYCStatus();
        setSuccess(false);
      }, 1500);
    } catch (err) {
      setError('Failed to update KYC status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReject = async () => {
    if (!user || !kycData) return;
    
    setIsUpdating(true);
    setError(null);
    
    try {
      await updateKYCStatus(userId, 'REJECTED', notes);
      setSuccess(true);
      setTimeout(() => {
        fetchKYCStatus();
        setSuccess(false);
      }, 1500);
    } catch (err) {
      setError('Failed to update KYC status');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = () => {
    switch (kycData?.status) {
      case 'APPROVED': return 'success';
      case 'REJECTED': return 'error';
      case 'PENDING': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" gutterBottom>
          KYC Verification - User: {userId}
        </Typography>
        
        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : !kycData ? (
          <Alert severity="info" sx={{ mb: 2 }}>
            No KYC data found for this user
          </Alert>
        ) : success ? (
          <Alert severity="success" sx={{ mb: 2 }}>
            KYC status updated successfully!
          </Alert>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item>
                      <Typography variant="subtitle1">Current Status:</Typography>
                    </Grid>
                    <Grid item>
                      <Chip 
                        label={kycData.status} 
                        color={getStatusColor()} 
                        size="medium"
                      />
                    </Grid>
                    {kycData.verifiedAt && (
                      <Grid item xs={12} sm="auto">
                        <Typography variant="body2" color="textSecondary">
                          Verified at: {formatDateTime(kycData.verifiedAt)}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Document Information
              </Typography>
              
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Document Type:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    {kycData.documentType || 'N/A'}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Document Number:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    {kycData.documentNumber || 'N/A'}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box border={1} borderColor="divider" borderRadius={1} p={2}>
                <Typography variant="subtitle1" gutterBottom>
                  Document Preview
                </Typography>
                <Box 
                  bgcolor="grey.100" 
                  height={200} 
                  display="flex" 
                  alignItems="center" 
                  justifyContent="center"
                >
                  <Typography color="textSecondary">
                    {kycData.documentType ? 
                      `Document Image: ${kycData.documentType}-${kycData.documentNumber}` : 
                      'No document uploaded'}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle1" gutterBottom>
                Admin Notes
              </Typography>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={{
                  width: '100%',
                  minHeight: '100px',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontFamily: 'inherit',
                  fontSize: '14px',
                }}
                placeholder="Add verification notes..."
              />
            </Grid>
            
            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end" gap={2}>
                <Button 
                  variant="outlined" 
                  onClick={onClose}
                  disabled={isUpdating}
                >
                  Close
                </Button>
                
                {kycData.status !== 'REJECTED' && (
                  <Button 
                    variant="contained" 
                    color="error"
                    onClick={handleReject}
                    disabled={isUpdating}
                  >
                    {isUpdating ? <CircularProgress size={24} /> : 'Reject KYC'}
                  </Button>
                )}
                
                {kycData.status !== 'APPROVED' && (
                  <Button 
                    variant="contained" 
                    color="success"
                    onClick={handleApprove}
                    disabled={isUpdating}
                  >
                    {isUpdating ? <CircularProgress size={24} /> : 'Approve KYC'}
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
        )}
      </Box>
    </Modal>
  );
};

export default KYCVerification;