// useAdminManagement.ts
import { useState, useEffect } from 'react';
import type { Admin } from '../types';
import { fetchAdmins, updateAdminRole } from '../services/adminService';
import type { Role } from '../../../auth/roles';

export const useAdminManagement = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAdmins = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAdmins();
      setAdmins(data.admins);
    } catch (err) {
      setError('Failed to load admin data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (adminId: string, newRole: string) => {
    try {
      const updatedAdmin = await updateAdminRole(adminId, newRole as Role, '');
      setAdmins(prev => 
        prev.map(admin => admin.id === adminId ? updatedAdmin : admin)
      );
      return true;
    } catch (err) {
      console.error('Role update failed:', err);
      return false;
    }
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  return {
    admins,
    loading,
    error,
    updateRole,
    refresh: loadAdmins
  };
};