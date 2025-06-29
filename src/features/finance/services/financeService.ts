import { apiClient } from '../../../lib/axios';
import type {
  Transaction,
  Wallet,
  TransferPayload,
  AdjustmentPayload,
  KYCStatus
} from '../types/financeTypes';

const BASE_URL = '/admin/finance';

export const fetchWalletBalance = async (userId: string): Promise<Wallet> => {
  const response = await apiClient.get(`${BASE_URL}/wallets/${userId}`);
  return response.data as Wallet;
};

export const fetchTransactions = async (
  params: Record<string, any>
): Promise<{ transactions: Transaction[]; total: number }> => {
  const response = await apiClient.get(`${BASE_URL}/transactions`, { params });
  const data = response.data as { items: Transaction[]; total: number };
  return {
    transactions: data.items,
    total: data.total
  };
};

export const initiateTransfer = async (
  payload: TransferPayload
): Promise<Transaction> => {
  const response = await apiClient.post(`${BASE_URL}/transfers`, payload, {
    headers: { 'Idempotency-Key': crypto.randomUUID() }
  });
  return response.data as Transaction;
};

export const adjustBalance = async (
  payload: AdjustmentPayload
): Promise<Transaction> => {
  const response = await apiClient.post(`${BASE_URL}/adjustments`, payload, {
    headers: { 'Idempotency-Key': crypto.randomUUID() }
  });
  return response.data as Transaction;
};

export const getKYCStatus = async (userId: string): Promise<KYCStatus> => {
  const response = await apiClient.get(`${BASE_URL}/kyc/${userId}`);
  return response.data as KYCStatus;
};

export const updateKYCStatus = async (
  userId: string, 
  status: 'APPROVED' | 'REJECTED',
  notes?: string
): Promise<KYCStatus> => {
  const response = await apiClient.patch(`${BASE_URL}/kyc/${userId}`, {
    status,
    adminNotes: notes
  });
  return response.data as KYCStatus;
};