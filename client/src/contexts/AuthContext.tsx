import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getGenderFromName } from '@/lib/utils';

interface User {
  id: number;
  username: string;
  email?: string;
  gender?: 'male' | 'female' | 'unknown';
  role: 'User' | 'Verifier' | 'Admin';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string, role: 'User' | 'Verifier' | 'Admin') => Promise<boolean>;
  logout: () => void;
  signup: (username: string, email: string, password: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (from localStorage or session)
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string, role: 'User' | 'Verifier' | 'Admin'): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // For demo purposes, accept any login
      // In production, this would make an API call
      let email: string;
      if (username.includes('@')) {
        email = username;
      } else {
        email = `${username}@example.com`;
      }
      const mockUser: User = {
        id: 1,
        username,
        email,
        gender: getGenderFromName(username),
        role
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // For demo purposes, accept any signup
      // In production, this would make an API call
      const mockUser: User = {
        id: Date.now(),
        username,
        email,
        gender: getGenderFromName(username),
        role: 'User' // Default role for signup
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      return true;
    } catch (error) {
      console.error('Signup failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    signup
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
} 