// src/auth/permissions.ts
// src/auth/permissions.ts
import type { Permission } from './roles';

export const permissionLabels: Record<Permission, string> = {
  USER_READ: 'View Users',
  USER_WRITE: 'Manage Users',
  DRAW_READ: 'View Draws',
  DRAW_WRITE: 'Manage Draws',
  RESULT_PUBLISH: 'Publish Results',
  FINANCE_READ: 'View Financial Reports',
  FINANCE_WRITE: 'Manage Financial Operations',
  SUPPORT_HANDLE: 'Handle Support Tickets',
  SETTINGS_WRITE: 'Modify System Settings',
  AUDIT_VIEW: 'View Audit Logs',
  ADMIN_MANAGE: 'Manage Admin Accounts'
};

export const permissionCategories = {
  USER_MANAGEMENT: ['USER_READ', 'USER_WRITE'],
  DRAW_OPERATIONS: ['DRAW_READ', 'DRAW_WRITE', 'RESULT_PUBLISH'],
  FINANCIAL_CONTROL: ['FINANCE_READ', 'FINANCE_WRITE'],
  SUPPORT: ['SUPPORT_HANDLE'],
  SYSTEM: ['SETTINGS_WRITE', 'ADMIN_MANAGE'],
  COMPLIANCE: ['AUDIT_VIEW']
};