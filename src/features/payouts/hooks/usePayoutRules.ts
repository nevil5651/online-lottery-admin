import { useState, useEffect, useCallback } from 'react';
import { getPayoutRules, updatePayoutRules, type PayoutRule } from '../services/payoutService';
import { useSnackbar } from 'notistack';

export const usePayoutRules = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [rules, setRules] = useState<PayoutRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRules = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPayoutRules();
      setRules(data);
    } catch (err) {
      const errorMessage = (err instanceof Error && err.message) ? err.message : 'Failed to load rules';
      setError(errorMessage);
      enqueueSnackbar('Failed to load payout rules', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  const updateRules = async (updatedRules: Partial<PayoutRule>[]) => {
    try {
      const data = await updatePayoutRules(updatedRules);
      setRules(data);
      enqueueSnackbar('Rules updated successfully', { variant: 'success' });
      return true;
    } catch (err) {
      const errorMessage = (err instanceof Error && err.message) ? err.message : 'Failed to update rules';
      enqueueSnackbar(errorMessage, { variant: 'error' });
      return false;
    }
  };

  const toggleRuleStatus = async (ruleId: string) => {
    const rule = rules.find(r => r.id === ruleId);
    if (!rule) return false;

    return updateRules([{
      id: ruleId,
      autoApprove: !rule.autoApprove
    }]);
  };

  useEffect(() => {
    loadRules();
  }, [loadRules]);

  return { 
    rules, 
    loading, 
    error, 
    updateRules, 
    toggleRuleStatus,
    refresh: loadRules 
  };
};