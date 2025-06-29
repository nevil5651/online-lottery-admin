import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';

type Role = 'SUPER_ADMIN' | 'FINANCE_MANAGER' | 'SUPPORT_AGENT' | 'FRAUD_ANALYST';

interface RBACContextProps {
  hasPermission: (requiredRole: Role) => boolean;
}

const RBACContext = createContext<RBACContextProps>({
  hasPermission: () => false
});

export const RBACProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  const hasPermission = (requiredRole: Role): boolean => {
    if (!user) return false;
    
    // Role hierarchy
    const roleHierarchy: Record<Role, number> = {
      SUPER_ADMIN: 4,
      FINANCE_MANAGER: 3,
      FRAUD_ANALYST: 2,
      SUPPORT_AGENT: 1
    };
    
    return roleHierarchy[user.role as Role] >= roleHierarchy[requiredRole];
  };

  return (
    <RBACContext.Provider value={{ hasPermission }}>
      {children}
    </RBACContext.Provider>
  );
};

export const useRBAC = () => useContext(RBACContext);