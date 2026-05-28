'use client';

// src/contexts/AuthContext.tsx
// EXPANDIDO: adicionado role, name e avatar para o Layout Privado funcionar
//Devemos conectar esses dados ao retorno real da API de login

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

//Tipos

export type UserRole = 'adopter' | 'ong';

export interface AuthUser {
  name: string;
  email: string;
  role: UserRole;
  avatar?: string; // URL da foto de perfil (opcional)
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  login: (token: string, userData: AuthUser) => void;
  logout: () => void;
  loading: boolean;
}

//Contexto

const AuthContext = createContext<AuthContextType | undefined>(undefined);

//Provider

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // ⚠️ MOCK TEMPORÁRIO — Removido para testar integração real
    /* */
    setIsAuthenticated(true);
    setUser({
      name: 'Lilyan Teste',
      email: 'lilyan@adotapet.com',
      role: 'ong', // troque para 'ong' para ver o painel da ONG
    });
    setLoading(false);
    return; // essa linha faz ignorar o resto do useEffect

    // ⚠️ fim do mock

    // Verifica token e dados do usuário no localStorage ao carregar
    const token = localStorage.getItem('adotapet_token');
    const storedUser = localStorage.getItem('adotapet_user');

    if (token && storedUser) {
      try {
        setIsAuthenticated(true);
        setUser(JSON.parse(storedUser));
      } catch {
        // Dados corrompidos — limpa tudo
        localStorage.removeItem('adotapet_token');
        localStorage.removeItem('adotapet_user');
      }
    }
    setLoading(false);
  }, []);

  const login = (token: string, userData: AuthUser) => {
    localStorage.setItem('adotapet_token', token);
    localStorage.setItem('adotapet_user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('adotapet_token');
    localStorage.removeItem('adotapet_user');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}