import  { useState } from 'react';
import { Box, Tabs, Tab, Paper, Typography, useTheme } from '@mui/material';
import PayoutAutomator from './PayoutAutomator';
import PayoutApproval from './PayoutApproval';
import BulkPayoutTool from './BulkPayoutTool';
import PayoutHistory from './PayoutHistory';
import { usePayouts } from '../hooks/usePayouts';

const PayoutDashboard = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const { summary } = usePayouts();

  const tabs = [
    { label: 'Pending Approval', component: <PayoutApproval /> },
    { label: 'Automation Rules', component: <PayoutAutomator /> },
    { label: 'Bulk Processing', component: <BulkPayoutTool /> },
    { label: 'Audit History', component: <PayoutHistory /> }
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <Paper elevation={0} sx={{ 
        p: 3, 
        mb: 3,
        borderRadius: 4,
        background: theme.palette.background.paper
      }}>
        <Typography variant="h4" gutterBottom>
          Payout Management
        </Typography>
        {summary && (
          <Box display="flex" gap={4} flexWrap="wrap">
            <StatCard 
              label="Total Pending" 
              value={summary.totalPayouts} 
              icon="📋" 
              color={theme.palette.primary.main} 
            />
            <StatCard 
              label="Total Amount" 
              value={`$${summary.totalAmount.toLocaleString()}`} 
              icon="💰" 
              color={theme.palette.success.main} 
            />
            <StatCard 
              label="High Value" 
              value={summary.highValueCount} 
              icon="⚠️" 
              color={theme.palette.warning.main} 
            />
            <StatCard 
              label="Tax Withheld" 
              value={`$${summary.taxWithheldTotal.toLocaleString()}`} 
              icon="🧾" 
              color={theme.palette.info.main} 
            />
          </Box>
        )}
      </Paper>

      <Paper elevation={0} sx={{ borderRadius: 4 }}>
        <Tabs 
          value={tabValue} 
          onChange={(_e, newValue) => setTabValue(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            px: 2,
            '& .MuiTab-root': {
              minHeight: 60,
              fontWeight: 600
            }
          }}
        >
          {tabs.map((tab, index) => (
            <Tab key={index} label={tab.label} />
          ))}
        </Tabs>
        
        <Box sx={{ p: 3 }}>
          {tabs[tabValue].component}
        </Box>
      </Paper>
    </Box>
  );
};

const StatCard = ({ label, value, icon, color }: { label: string; value: string | number; icon: string; color: string }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
    <Box sx={{
      width: 48,
      height: 48,
      borderRadius: 2,
      background: `${color}20`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 24
    }}>
      {icon}
    </Box>
    <Box>
      <Typography variant="body2" color="textSecondary">{label}</Typography>
      <Typography variant="h6" fontWeight="bold">{value}</Typography>
    </Box>
  </Box>
);

export default PayoutDashboard;