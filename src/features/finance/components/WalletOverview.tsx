import React from 'react';
import { Card, CardContent, Grid, Typography, Skeleton } from '@mui/material';
import type { Wallet } from '../types/financeTypes';

interface WalletOverviewProps {
  wallet: Wallet | null;
  loading: boolean;
}

const WalletOverview: React.FC<WalletOverviewProps> = ({ wallet, loading }) => {
  return (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Wallet Summary
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            {loading ? (
              <Skeleton variant="rectangular" height={80} />
            ) : (
              <Card variant="outlined">
                <CardContent>
                  <Typography color="textSecondary">Available Balance</Typography>
                  <Typography variant="h4">
                    {wallet?.currency} {wallet?.balance.toFixed(2)}
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Grid>
          
          <Grid item xs={12} md={4}>
            {loading ? (
              <Skeleton variant="rectangular" height={80} />
            ) : (
              <Card variant="outlined">
                <CardContent>
                  <Typography color="textSecondary">Locked Funds</Typography>
                  <Typography variant="h4">
                    {wallet?.currency} {wallet?.lockedBalance.toFixed(2)}
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Grid>
          
          <Grid item xs={12} md={4}>
            {loading ? (
              <Skeleton variant="rectangular" height={80} />
            ) : (
              <Card variant="outlined">
                <CardContent>
                  <Typography color="textSecondary">Last Updated</Typography>
                  <Typography variant="body1">
                    {new Date(wallet?.lastUpdated || '').toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default WalletOverview;