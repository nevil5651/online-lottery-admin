import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchDraws, fetchDrawById, createDraw, updateDraw, cancelDraw, postResults 
} from './drawApi';
import type { Draw, DrawFilters } from '../types/drawTypes';

export const useDraws = (filters: DrawFilters, page: number, pageSize: number) => {
  return useQuery({
    queryKey: ['draws', filters, page, pageSize],
    queryFn: () => fetchDraws(filters, page, pageSize),
    // keepPreviousData: true, // Uncomment if using React Query v4+
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useDraw = (id: string) => {
  return useQuery({
    queryKey: ['draw', id],
    queryFn: () => fetchDrawById(id),
    enabled: !!id,
  });
};

export const useCreateDraw = () => {
  const queryClient = useQueryClient();
  return useMutation<
    any, // Replace 'any' with the actual response type if known
    Error,
    Partial<Draw>
  >({
    mutationFn: (drawData: Partial<Draw>) => createDraw(drawData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['draws'] });
    },
  });
};

export const useUpdateDraw = () => {
  const queryClient = useQueryClient();
  return useMutation<
    any, // Replace 'any' with the actual response type if known
    Error,
    { id: string; data: Partial<Draw> }
  >({
    mutationFn: ({ id, data }: { id: string; data: Partial<Draw> }) => updateDraw(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['draws'] });
      queryClient.invalidateQueries({ queryKey: ['draw', variables.id] });
    },
  });
};

export const useCancelDraw = () => {
  const queryClient = useQueryClient();
  return useMutation<
    any,    // Replace 'any' with the actual response type if known
    Error,
    string  // The variable type (id: string)
  >({
    mutationFn: (id: string) => cancelDraw(id),
    onSuccess: (_: any, id: string) => {
      queryClient.invalidateQueries({ queryKey: ['draws'] });
      queryClient.invalidateQueries({ queryKey: ['draw', id] });
    },
  });
};

export const usePostResults = () => {
  const queryClient = useQueryClient();
  return useMutation<
    unknown, // The mutation result type matches the return type of postResults
    Error,
    { id: string; winningNumbers: number[] }
  >({
    mutationFn: ({ id, winningNumbers }: { id: string; winningNumbers: number[] }) =>
      postResults(id, winningNumbers),
    onSuccess: (_: unknown, variables: { id: string; winningNumbers: number[] }) => {
      queryClient.invalidateQueries({ queryKey: ['draws'] });
      queryClient.invalidateQueries({ queryKey: ['draw', variables.id] });
    },
  });
};