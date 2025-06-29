export type GameType = 'pick3' | 'pick4' | 'pick6' | 'powerball' | 'raffle';
export type ResultStatus = 'draft' | 'pending_approval' | 'published' | 'locked';

export interface LotteryResult {
  id: string;
  drawId: string;
  gameType: GameType;
  numbers: number[];
  status: ResultStatus;
  createdAt: Date;
  publishedAt?: Date;
  approvedBy: string[];
  rngMethod?: 'algorithm' | 'physical';
  auditTrail: AuditEntry[];
}

export interface AuditEntry {
  action: 'create' | 'update' | 'approve' | 'publish' | 'lock';
  userId: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface ResultSubmission {
  drawId: string;
  gameType: GameType;
  numbers: number[];
  rngMethod?: 'algorithm' | 'physical';
  requireApproval: boolean;
}

export interface ResultApiResponse {
  numbers: number[];
  status: ResultStatus;
  lastUpdated?: Date;
}