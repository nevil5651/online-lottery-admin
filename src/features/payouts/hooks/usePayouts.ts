import { useState, useEffect, useCallback } from 'react';
import { 
  fetchPayouts, 
  approvePayout as apiApprovePayout,
  rejectPayout as apiRejectPayout,
  retryFailedPayout as apiRetryPayout,
  getPayoutSummary,
  type Payout,
  type PayoutFilterOptions,
} from '../services/payoutService';
import { useAuth } from '../../../contexts/AuthContext';
import { useSnackbar } from 'notistack';
import type { PayoutSummary } from '../types/payoutTypes';

export const usePayouts = (initialFilters?: PayoutFilterOptions) => {
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [summary, setSummary] = useState<PayoutSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<PayoutFilterOptions>(initialFilters || {});

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [payoutsData, summaryData] = await Promise.all([
        fetchPayouts(filters),
        getPayoutSummary()
      ]);
      setPayouts(payoutsData);
      setSummary(summaryData);
    } catch (err) {
      const errorMsg = err && typeof err === 'object' && 'message' in err ? (err as any).message : 'Failed to load payouts';
      setError(errorMsg);
      enqueueSnackbar('Failed to load payout data', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [filters, enqueueSnackbar]);

  const approvePayout = async (payoutId: string) => {
    if (!user) return;
    try {
      await apiApprovePayout(payoutId, user.id);
      await loadData();
      enqueueSnackbar('Payout approved successfully', { variant: 'success' });
    } catch (err) {
      const errorMsg = err && typeof err === 'object' && 'message' in err ? (err as any).message : 'Approval failed';
      enqueueSnackbar(errorMsg, { variant: 'error' });
    }
  };

  const rejectPayout = async (payoutId: string, reason: string) => {
    if (!user) return;
    try {
      await apiRejectPayout(payoutId, user.id, reason);
      await loadData();
      enqueueSnackbar('Payout rejected successfully', { variant: 'success' });
    } catch (err) {
      const errorMsg = err && typeof err === 'object' && 'message' in err ? (err as any).message : 'Rejection failed';
      enqueueSnackbar(errorMsg, { variant: 'error' });
    }
  };

  const retryPayout = async (payoutId: string) => {
    try {
      await apiRetryPayout(payoutId);
      await loadData();
      enqueueSnackbar('Retry initiated successfully', { variant: 'success' });
    } catch (err) {
      const errorMsg = err && typeof err === 'object' && 'message' in err ? (err as any).message : 'Retry failed';
      enqueueSnackbar(errorMsg, { variant: 'error' });
    }
  };

  const updateFilters = (newFilters: PayoutFilterOptions) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { 
    payouts, 
    summary, 
    loading, 
    error, 
    filters,
    approvePayout, 
    rejectPayout, 
    retryPayout,
    refresh: loadData,
    updateFilters
  };
};