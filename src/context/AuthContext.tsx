import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

interface RegisterData {
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  password: string;
}

const demoUser: User = {
  id: '1',
  prenom: 'Jean',
  nom: 'Dupont',
  email: 'demo@6dabouls.com',
  telephone: '+33 6 12 34 56 78',
  kycStatus: 'verifie',
  createdAt: new Date('2024-01-15'),
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setIsLoading(false);
    if (email === 'demo@6dabouls.com' && password === 'Demo1234') {
      setUser(demoUser);
      return { success: true };
    }
    return { success: false, error: 'Email ou mot de passe incorrect' };
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setIsLoading(false);
    const newUser: User = {
      id: Date.now().toString(),
      prenom: data.prenom,
      nom: data.nom,
      email: data.email,
      telephone: data.telephone,
      kycStatus: 'non_commence',
      createdAt: new Date(),
    };
    setUser(newUser);
    return { success: true };
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
