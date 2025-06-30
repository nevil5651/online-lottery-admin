export interface Payout {
  id: string;
  drawId: string;
  userId: string;
  username: string;
  tier: 'JACKPOT' | 'SECOND' | 'MINOR' | 'OTHER';
  amount: number;
  currency: string;
  method: 'WALLET' | 'BANK' | 'CRYPTO' | 'CHECK' | 'OTHER';
  status: 'PENDING' | 'PROCESSING' | 'PAID' | 'FAILED' | 'REVERSED' | 'HOLD';
  createdAt: string;
  updatedAt?: string;
  taxWithheld: number;
  netAmount: number;
  referenceId?: string;
  adminNotes?: string;
  requiresManualReview?: boolean;
}

export interface PayoutRule {
  id: string;
  tier: string;
  autoApprove: boolean;
  minAmount: number;
  maxAmount?: number;
  paymentMethod: string;
  requiresTaxForm: boolean;
  priority: number;
  createdAt: string;
  updatedAt?: string;
}

export interface BulkPayoutPayload {
  payoutIds: string[];
  approvedBy: string;
  ipAddress: string;
  userAgent: string;
}

export interface PayoutAuditLog {
  id: string;
  action: 'APPROVE' | 'REJECT' | 'BULK_PAYOUT' | 'RULE_UPDATE' | 'STATUS_CHANGE';
  payoutIds: string[];
  adminId: string;
  adminName: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  notes?: string;
  previousStatus?: string;
  newStatus?: string;
}

export interface PayoutSummary {
  totalAmount: number;
  totalPayouts: number;
  pendingCount: number;
  highValueCount: number;
  averageAmount: number;
  taxWithheldTotal: number;
}

export interface PayoutFilterOptions {
  status?: string[];
  method?: string[];
  tier?: string[];
  dateRange?: [string, string];
  minAmount?: number;
  maxAmount?: number;
}