export interface Transaction {
  id: string;
  userId: string;
  username: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'ADJUSTMENT' | 'WINNING' | 'TRANSFER' | 'BONUS' | 'FEE';
  amount: number;
  currency: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REVERSED';
  createdAt: string;
  updatedAt: string;
  referenceId?: string;
  adminNotes?: string;
  ipAddress?: string;
}

export interface Wallet {
  userId: string;
  username: string;
  balance: number;
  lockedBalance: number;
  currency: string;
  lastUpdated: string;
  status: 'ACTIVE' | 'LOCKED' | 'SUSPENDED';
}

export interface TransferPayload {
  senderId: string;
  recipientId: string;
  amount: number;
  currency: string;
  reference: string;
}

export interface AdjustmentPayload {
  userId: string;
  amount: number;
  type: 'CREDIT' | 'DEBIT';
  reason: 'COMPENSATION' | 'FRAUD' | 'ERROR_CORRECTION' | 'BONUS' | 'OTHER';
  reference: string;
  notes?: string;
}

export interface KYCStatus {
  userId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'NOT_SUBMITTED';
  verifiedAt?: string;
  documentType?: 'PASSPORT' | 'DRIVER_LICENSE' | 'NATIONAL_ID';
  documentNumber?: string;
  adminNotes?: string;
}