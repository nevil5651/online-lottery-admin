import React, { createContext, useContext } from 'react';

type UserRole = 'super-admin' | 'admin' | 'agent';

interface UserContextType {
  role: UserRole;
  userId: string;
  name: string;
}

const UserContext = createContext<UserContextType>({
  role: 'admin',
  userId: '',
  name: ''
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // In a real app, this would come from auth state
  const user = {
    role: 'admin' as UserRole,
    userId: 'admin123',
    name: 'Admin User'
  };

  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);