import { useQuery } from '@tanstack/react-query';
import { fetchWalletBalance } from '../services/financeService';
import type { Wallet } from '../types/financeTypes';

export const useFinance = (userId: string) => {
  return useQuery<Wallet, Error>({
    queryKey: ['wallet', userId],
    queryFn: () => fetchWalletBalance(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};