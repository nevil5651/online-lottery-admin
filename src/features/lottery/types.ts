export type DrawType = 'daily' | 'weekly' | 'special' | 'instant-win';

export interface PrizeTier {
  id: string;
  name: string;
  description: string;
  value: number;
  valueType: 'fixed' | 'percentage';
  numberOfWinners: number;
}

export interface DrawSchedule {
  startDate: Date;
  endDate: Date;
  drawTime: Date;
  cutoffMinutes: number; // Minutes before draw when sales stop
  autoCutoff?: boolean; 
  conflictStrategy: 'prevent' | 'adjust' | 'notify';
}

export interface DrawSecurity {
  rngMethod: 'algorithm' | 'physical';
  requiredApprovals: number;
  auditTrail: boolean;
}

export interface DrawFormData {
  name: string;
  type: DrawType;
  description: string;
  ticketPrice: number;
  maxTicketsPerUser: number;
  totalTickets?: number; // Optional for limited draws
  schedule: DrawSchedule;
  prizes: PrizeTier[];
  security: DrawSecurity;
}