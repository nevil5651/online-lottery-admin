export type DrawStatus = 'scheduled' | 'open' | 'closed' | 'completed' | 'cancelled';
export type DrawType = 'daily' | 'weekly' | 'special' | 'pick3' | 'pick4' | 'pick6' | 'raffle';
export type RNGMethod = 'algorithm' | 'physical';


export interface Draw {
  // ... existing fields ...
  resultStatus?: 'draft' | 'pending_approval' | 'published' | 'locked';
  winningNumbers?: number[];
  lastResultUpdate?: Date;
}

export interface PrizeTier {
  id: string;
  name: string;
  value: number;
  valueType: 'fixed' | 'percentage';
  winners: number;
}

export interface DrawSchedule {
  startDate: Date;
  endDate: Date;
  drawTime: Date;
  cutoffMinutes: number;
  isRecurring: boolean;
  recurrenceRule?: string;
}

export interface DrawSecurity {
  rngMethod: RNGMethod;
  requiredApprovals: number;
  approvedBy: string[];
}

export interface Draw {
  id: string;
  name: string;
  type: DrawType;
  status: DrawStatus;
  ticketPrice: number;
  prizes: PrizeTier[];
  schedule: DrawSchedule;
  security: DrawSecurity;
  winningNumbers?: number[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Filter types
export interface DrawFilters {
  status?: DrawStatus[];
  type?: DrawType[];
  startDate?: Date | null;
  endDate?: Date | null;
  search?: string;
}