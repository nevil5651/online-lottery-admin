import { useQuery } from '@tanstack/react-query';
import { fetchTransactions } from '../services/financeService';
import type { Transaction } from '../types/financeTypes';

export const useTransactions = (params: Record<string, any>) => {
  return useQuery<{ transactions: Transaction[]; total: number }, Error>({
    queryKey: ['transactions', params],
    queryFn: () => fetchTransactions(params),
    retry: 2,
  });
};