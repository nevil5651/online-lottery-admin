// src/features/admin-management/types.ts
import type { Role } from '../../auth/roles';

export type AdminStatus = 'active' | 'suspended' | 'invited';

export interface Admin {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: AdminStatus;
  lastActive?: string;
}