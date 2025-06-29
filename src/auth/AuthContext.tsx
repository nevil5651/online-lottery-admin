// AuthContext.tsx temporraily holds the authentication context for the admin management system.
// It provides user information and permission checks based on roles.
import React, { createContext, useContext, type ReactNode } from 'react';
import { type Role, type Permission, rolePermissions } from './roles';

interface AuthState {
  id: string;
  name: string;
  email: string;
  role: Role;
  permissions: Permission[];
}

interface AuthContextType {
  user: AuthState | null;
  hasPermission: (permission: Permission) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = React.useState<AuthState | null>(null);
  
  // Fetch user data on mount (simulated)
  React.useEffect(() => {
    // In real app, fetch from API
    setUser({
      id: "1",
      name: "Admin User",
      email: "admin@lottery.com",
      role: "SUPER_ADMIN",
      permissions: rolePermissions.SUPER_ADMIN
    });
  }, []);

  const hasPermission = (permission: Permission) => {
    return !!user?.permissions.includes(permission);
  };

  return (
    <AuthContext.Provider value={{ user, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};