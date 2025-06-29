// roles.ts
export type Role = 
  | 'SUPER_ADMIN'
  | 'OPERATOR'
  | 'FINANCE'
  | 'SUPPORT'
  | 'AUDITOR';

export type Permission = 
  | 'USER_READ' | 'USER_WRITE'
  | 'DRAW_READ' | 'DRAW_WRITE'
  | 'RESULT_PUBLISH'
  | 'FINANCE_READ' | 'FINANCE_WRITE'
  | 'SUPPORT_HANDLE'
  | 'SETTINGS_WRITE'
  | 'AUDIT_VIEW'
  | 'ADMIN_MANAGE';

export const rolePermissions: Record<Role, Permission[]> = {
    SUPER_ADMIN: [
        'ADMIN_MANAGE',
        'USER_READ',
        'USER_WRITE',
        'DRAW_READ',
        'DRAW_WRITE',
        'RESULT_PUBLISH',
        'FINANCE_READ',
        'FINANCE_WRITE',
        'SUPPORT_HANDLE',
        'SETTINGS_WRITE',
        'AUDIT_VIEW'
    ],
    OPERATOR: [
        'USER_READ',
        'USER_WRITE',
        'DRAW_READ',
        'DRAW_WRITE',
        'RESULT_PUBLISH'
    ],
    FINANCE: [
        'FINANCE_READ',
        'FINANCE_WRITE'
    ],
    SUPPORT: [
        'SUPPORT_HANDLE'
    ],
    AUDITOR: [
        'AUDIT_VIEW'
    ]
};