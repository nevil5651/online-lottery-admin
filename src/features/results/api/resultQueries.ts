import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  submitResults,
  approveResults,
  publishResults,
  lockResults,
  getResultHistory,
  getExistingResults
} from './resultApi';
import { type LotteryResult, type ResultSubmission } from '../types/resultTypes';

export const useResultHistory = (drawId: string) => {
  return useQuery({
    queryKey: ['results', 'history', drawId],
    queryFn: () => getResultHistory(drawId),
    enabled: !!drawId,
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
};

export const useSubmitResults = () => {
  const queryClient = useQueryClient();
  return useMutation<LotteryResult, Error, ResultSubmission>({
    mutationFn: submitResults,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['results'] });
    }
  });
};

export const useGetExistingResults = (drawId: string, options = {}) => {
  return useQuery({
    queryKey: ['results', drawId],
    queryFn: () => getExistingResults(drawId),
    ...options
  });
};

// Add these to existing resultQueries.ts

export const useApproveResults = () => {
  const queryClient = useQueryClient();
  return useMutation<LotteryResult, Error, { resultId: string; userId: string }>({
    mutationFn: ({ resultId, userId }: { resultId: string; userId: string }) => 
      approveResults(resultId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['results'] });
    }
  });
};

export const usePublishResults = () => {
  const queryClient = useQueryClient();
  return useMutation<LotteryResult, Error, string>({
    mutationFn: (resultId: string) => publishResults(resultId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['results'] });
    }
  });
};

export const useLockResults = () => {
  const queryClient = useQueryClient();
  return useMutation<LotteryResult, Error, string>({
    mutationFn: (resultId: string) => lockResults(resultId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['results'] });
    }
  });
};

// Similar hooks for approveResults, publishResults, lockResults