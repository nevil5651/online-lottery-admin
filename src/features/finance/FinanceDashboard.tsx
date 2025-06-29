import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Button, 
  Container,
  CircularProgress,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import WalletOverview from './components/WalletOverview';
import TransactionTable from './components/TransactionTable';
import AdjustmentModal from './components/AdjustmentModal';
import TransferForm from './components/TransferForm';
import KYCVerification from './components/KYCVerification';
import { useFinance } from './hooks/useFinance';
import { useAuth } from '../../contexts/AuthContext';
import { useRBAC } from '../../contexts/RBACContext';

const FinanceDashboard: React.FC = () => {
  const { user } = useAuth();
  const { hasPermission } = useRBAC();
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [adjustmentModalOpen, setAdjustmentModalOpen] = useState(false);
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [kycModalOpen, setKycModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const { data: wallet, isLoading, error } = useFinance(selectedUserId || user?.id || '');

  const handleUserSearch = () => {
    if (searchInput.trim()) {
      setSelectedUserId(searchInput.trim());
    }
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSelectedUserId('');
  };

  const canAdjust = hasPermission('FINANCE_MANAGER');
  const canTransfer = hasPermission('SUPER_ADMIN');

  return (
    <Container maxWidth="xl">
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>
          Financial Management Dashboard
        </Typography>
        
        <Grid container spacing={3} alignItems="center" mb={3}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search User ID"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleUserSearch()}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button 
                      onClick={handleUserSearch}
                      disabled={!searchInput.trim()}
                    >
                      <SearchIcon />
                    </Button>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Status Filter</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Status Filter"
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="ACTIVE">Active</MenuItem>
                <MenuItem value="LOCKED">Locked</MenuItem>
                <MenuItem value="SUSPENDED">Suspended</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={5} display="flex" justifyContent="flex-end" gap={1}>
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => setAdjustmentModalOpen(true)}
              disabled={!canAdjust}
            >
              Adjust Balance
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => setTransferModalOpen(true)}
              disabled={!canTransfer}
            >
              Transfer Funds
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => setKycModalOpen(true)}
            >
              Verify KYC
            </Button>
            {selectedUserId && (
              <Button 
                variant="text" 
                onClick={handleClearSearch}
              >
                Clear Search
              </Button>
            )}
          </Grid>
        </Grid>
        
        {error ? (
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Typography color="error">Error loading wallet data: {error.message}</Typography>
            </CardContent>
          </Card>
        ) : (
          <WalletOverview 
            wallet={wallet ?? null} 
            loading={isLoading} 
          />
        )}
      </Box>
      
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Transaction History
        </Typography>
        <TransactionTable 
          userId={selectedUserId} 
          statusFilter={statusFilter === 'all' ? undefined : statusFilter}
        />
      </Box>
      
      <AdjustmentModal 
        open={adjustmentModalOpen}
        onClose={() => setAdjustmentModalOpen(false)}
        userId={selectedUserId || user?.id || ''}
        currentBalance={wallet?.balance || 0}
      />
      
      <TransferForm 
        open={transferModalOpen}
        onClose={() => setTransferModalOpen(false)}
      />
      
      <KYCVerification 
        open={kycModalOpen}
        onClose={() => setKycModalOpen(false)}
        userId={selectedUserId || user?.id || ''}
      />
    </Container>
  );
};

export default FinanceDashboard;