export type UserStatus = 'active' | 'pending_kyc' | 'suspended' | 'banned';
export type UserRole = 'player' | 'agent' | 'super-admin' | 'auditor' | 'support';

export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  avatarUrl?: string;
  status: UserStatus;
  roles: UserRole[];
  lastLogin: string;
  createdAt: string;
  kycDocuments?: string[];
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ListUsersParams {
  page: number;
  pageSize: number;
  search?: string;
  status?: UserStatus | 'all';
  role?: UserRole | 'all';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
