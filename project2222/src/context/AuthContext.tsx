import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  currentUser: User | null;
  login: (role: UserRole, id: string, name: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  hasPermission: (action: 'view' | 'create' | 'update' | 'delete', resource: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const login = (role: UserRole, id: string, name: string) => {
    setCurrentUser({
      id: crypto.randomUUID(),
      name,
      role,
      entityId: id
    });
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // Permission matrix based on user roles
  const hasPermission = (action: 'view' | 'create' | 'update' | 'delete', resource: string): boolean => {
    if (!currentUser) return false;

    if (currentUser.role === 'administrator') {
      // Admins can do everything except modify scores
      if (resource === 'score' && action === 'update') {
        return false;
      }
      return true;
    }

    if (currentUser.role === 'teacher') {
      // Teachers can only modify scores
      if (resource === 'score' && action === 'update') {
        return true;
      }
      // Teachers can view most resources
      if (action === 'view') {
        return true;
      }
      return false;
    }

    if (currentUser.role === 'student') {
      // Students can only view
      if (action === 'view') {
        return true;
      }
      return false;
    }

    return false;
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      login,
      logout,
      isAuthenticated: !!currentUser,
      hasPermission
    }}>
      {children}
    </AuthContext.Provider>
  );
};