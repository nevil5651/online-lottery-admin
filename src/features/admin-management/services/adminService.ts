// src/features/admin-management/services/adminService.ts
import type { Role } from '../../../auth/roles';
import type { Admin } from '../types';

// Added pagination params for real API integration
export const fetchAdmins = async (
  page: number = 0, 
  pageSize: number = 10
): Promise<{ admins: Admin[]; total: number }> => {
  // API integration example:
  // const response = await axios.get(`/api/admins?page=${page}&limit=${pageSize}`);
  // return response.data;
  
  return {
    admins: [ {
      id: '1',
      name: 'Super Admin',
      email: 'super@lottery.com',
      role: 'SUPER_ADMIN',
      status: 'active'
    },
    {
      id: '2',
      name: 'Finance Manager',
      email: 'finance@lottery.com',
      role: 'FINANCE',
      status: 'active'
    },
    {
      id: '3',
      name: 'Support Agent',
      email: 'support@lottery.com',
      role: 'SUPPORT',
      status: 'active'
    }
  ], 
    total: 3
  };
};

// Added audit logging capability
export const updateAdminRole = async (
  adminId: string, 
  newRole: Role,
  actorId: string,
  reason?: string
): Promise<Admin> => {
  // Real API call would include:
  // {
  //   newRole,
  //   audit: { actor: actorId, action: 'ROLE_CHANGE', reason }
  // }
  return {} as Admin;
};