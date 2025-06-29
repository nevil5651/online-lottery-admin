import { apiClient } from '../../../lib/axios';
import type {
  LotteryResult,
  ResultSubmission
} from '../types/resultTypes';

export const submitResults = async (data: ResultSubmission): Promise<LotteryResult> => {
  const response = await apiClient.post<LotteryResult>('/results', data);
  return response.data;
};

export const getExistingResults = async (drawId: string) => {
  const response = await apiClient.get(`/draws/${drawId}/results`);
  return response.data;
};

export const approveResults = async (resultId: string, userId: string): Promise<LotteryResult> => {
  const response = await apiClient.patch<LotteryResult>(`/results/${resultId}/approve`, { userId });
  return response.data;
};

export const publishResults = async (resultId: string): Promise<LotteryResult> => {
  const response = await apiClient.patch<LotteryResult>(`/results/${resultId}/publish`);
  return response.data;
};

export const lockResults = async (resultId: string): Promise<LotteryResult> => {
  const response = await apiClient.patch<LotteryResult>(`/results/${resultId}/lock`);
  return response.data;
};

export const getResultHistory = async (drawId: string): Promise<LotteryResult[]> => {
  const response = await apiClient.get<LotteryResult[]>(`/results?drawId=${drawId}`);
  return response.data;
};