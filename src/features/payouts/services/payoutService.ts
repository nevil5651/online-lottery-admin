import {apiClient} from '../../../lib/axios';
import type { 
  Payout, 
  PayoutRule, 
  BulkPayoutPayload,
  PayoutFilterOptions,
  PayoutSummary,
  PayoutAuditLog
} from '../types/payoutTypes';

const PAYOUTS_API_PATH = '/admin/payouts';

export const fetchPayouts = async (filters?: PayoutFilterOptions): Promise<Payout[]> => {
  const response = await apiClient.get(`${PAYOUTS_API_PATH}`, { params: filters });
  return response.data as Payout[];
};

export const fetchPayoutById = async (id: string): Promise<Payout> => {
  const response = await apiClient.get(`${PAYOUTS_API_PATH}/${id}`);
  return response.data as Payout;
};

export const approvePayout = async (payoutId: string, adminId: string): Promise<void> => {
  await apiClient.post(`${PAYOUTS_API_PATH}/${payoutId}/approve`, { adminId });
};

export const rejectPayout = async (payoutId: string, adminId: string, reason: string): Promise<void> => {
  await apiClient.post(`${PAYOUTS_API_PATH}/${payoutId}/reject`, { adminId, reason });
};

export const processBulkPayouts = async (payload: BulkPayoutPayload): Promise<{ processed: number }> => {
  const response = await apiClient.post<{ processed: number }>(`${PAYOUTS_API_PATH}/bulk`, payload);
  return response.data;
};

export const getPayoutRules = async (): Promise<PayoutRule[]> => {
  const response = await apiClient.get<PayoutRule[]>(`${PAYOUTS_API_PATH}/rules`);
  return response.data as PayoutRule[];
};

export const updatePayoutRules = async (rules: Partial<PayoutRule>[]): Promise<PayoutRule[]> => {
  const response = await apiClient.put<PayoutRule[]>(`${PAYOUTS_API_PATH}/rules`, { rules });
  return response.data as PayoutRule[];
};

export const getPayoutSummary = async (): Promise<PayoutSummary> => {
  const response = await apiClient.get<PayoutSummary>(`${PAYOUTS_API_PATH}/summary`);
  return response.data;
};

export const getAuditLogs = async (page = 1, pageSize = 20): Promise<PayoutAuditLog[]> => {
  const response = await apiClient.get<PayoutAuditLog[]>(`${PAYOUTS_API_PATH}/audit`, { 
    params: { page, pageSize } 
  });
  return response.data;
};

export const retryFailedPayout = async (payoutId: string): Promise<void> => {
  await apiClient.post(`${PAYOUTS_API_PATH}/${payoutId}/retry`);
};

export const exportPayouts = async (format: 'csv' | 'xlsx', filters?: PayoutFilterOptions): Promise<void> => {
  const response = await apiClient.get(`${PAYOUTS_API_PATH}/export`, {
    params: { format, ...filters },
    responseType: 'blob'
  });
 // return response.data;
};

export type { PayoutRule, Payout, PayoutFilterOptions };
