import React, { createContext, useContext } from 'react';

interface PermissionContextValue {
  can: (action: string, resource: string) => boolean;
}

const PermissionContext = createContext<PermissionContextValue>({
  can: () => true // Default: allow everything
});

export const usePermissions = () => useContext(PermissionContext);

export const PermissionProvider: React.FC<{ 
  children: React.ReactNode;
  permissions: (action: string, resource: string) => boolean;
}> = ({ children, permissions }) => {
  return (
    <PermissionContext.Provider value={{ can: permissions }}>
      {children}
    </PermissionContext.Provider>
  );
};