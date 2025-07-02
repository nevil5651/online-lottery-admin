// src/features/lottery/components/DrawCreator/DrawSummaryCard.tsx
import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Typography,
  Chip,
  Stack,
  useTheme
} from '@mui/material';
import {
  AccessTime as TimeIcon,
  MonetizationOn as MoneyIcon,
  Security as SecurityIcon,
  EmojiEvents as PrizeIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import type { DrawFormData } from './types';
import dayjs from 'dayjs';

interface DrawSummaryCardProps {
  data: DrawFormData;
}

export const DrawSummaryCard: React.FC<DrawSummaryCardProps> = ({ data }) => {
  const theme = useTheme();
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  // Format currency values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Format date with timezone
  const formatDate = (date: Date) => {
    return dayjs(date).tz(userTimezone).format('DD MMM YYYY, hh:mm A');
  };

  return (
    <Card sx={{ 
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: 2,
      boxShadow: theme.shadows[2]
    }}>
      <CardHeader
        title="Draw Summary"
        titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
        action={
          <Chip 
            label={data.type.toUpperCase()} 
            color="primary" 
            sx={{ textTransform: 'uppercase' }}
          />
        }
      />
      <Divider />
      
      <CardContent>
        {/* Basic Information Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            <MoneyIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
            Basic Information
          </Typography>
          
          <Grid container spacing={2} sx={{ pl: 3 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                Draw Name
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {data.name || '-'}
              </Typography>
            </Grid>
            
            <Grid item xs={6} md={3}>
              <Typography variant="body2" color="text.secondary">
                Ticket Price
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {formatCurrency(data.ticketPrice)}
              </Typography>
            </Grid>
            
            <Grid item xs={6} md={3}>
              <Typography variant="body2" color="text.secondary">
                Max Tickets/User
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {data.maxTicketsPerUser}
              </Typography>
            </Grid>
            
            {data.description && (
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  Description
                </Typography>
                <Typography variant="body1">
                  {data.description}
                </Typography>
              </Grid>
            )}
          </Grid>
        </Box>
        
        {/* Schedule Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            <CalendarIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
            Schedule
          </Typography>
          
          <Grid container spacing={2} sx={{ pl: 3 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                Sales Start
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {formatDate(data.schedule.startDate)}
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                Sales End
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {formatDate(data.schedule.endDate)}
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                Draw Time
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {formatDate(data.schedule.drawTime)}
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                Sales Cutoff
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {data.schedule.cutoffMinutes} minutes before draw
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                Time Zone
              </Typography>
              <Typography variant="body1">
                {userTimezone}
              </Typography>
            </Grid>
          </Grid>
        </Box>
        
        {/* Prizes Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            <PrizeIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
            Prize Distribution
          </Typography>
          
          <Grid container spacing={2} sx={{ pl: 3 }}>
            {data.prizes.map((prize, index) => (
              <Grid item xs={12} key={prize.id}>
                <Box sx={{ 
                  p: 2, 
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 1,
                  bgcolor: index === 0 ? theme.palette.success.light : 'background.paper'
                }}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="subtitle2" fontWeight={600}>
                      {prize.name}
                    </Typography>
                    <Chip 
                      label={`Tier ${index + 1}`} 
                      size="small" 
                      color={index === 0 ? "success" : "primary"}
                    />
                  </Stack>
                  
                  <Stack direction="row" spacing={3} sx={{ mt: 1 }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Prize Value
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {prize.valueType === 'fixed' 
                          ? formatCurrency(prize.value) 
                          : `${prize.value}% of pool`}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Winners
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {prize.numberOfWinners}
                      </Typography>
                    </Box>
                  </Stack>
                  
                  {prize.description && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {prize.description}
                    </Typography>
                  )}
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
        
        {/* Security Section */}
        <Box>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            <SecurityIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
            Security Settings
          </Typography>
          
          <Grid container spacing={2} sx={{ pl: 3 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                RNG Method
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {data.security.rngMethod === 'algorithm' 
                  ? 'Algorithmic (SHA-256)' 
                  : 'Physical Draw Mechanism'}
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                Required Approvals
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {data.security.requiredApprovals} admin(s)
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                Audit Trail
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {data.security.auditTrail ? 'Enabled' : 'Disabled'}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};