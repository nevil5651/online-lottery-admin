import React, { createContext, useContext } from 'react';

type UserRole = 'super-admin' | 'admin' | 'agent';

interface AuthContextType {
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  } | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = React.useState<AuthContextType['user']>(null);
  
  // In real app, this would call your authentication API
  const login = async (email: string, password: string) => {
    // Mock login logic
    setUser({
      id: 'user-123',
      name: 'Admin User',
      email,
      role: email.includes('super') ? 'super-admin' : 
            email.includes('admin') ? 'admin' : 'agent'
    });
  };
  
  const logout = () => {
    setUser(null);
  };
  
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);