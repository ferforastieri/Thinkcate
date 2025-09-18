import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: number;
  email: string;
  name: string;
  avatar?: string;
}

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredUser();
  }, []);

  const loadStoredUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('@thinkcate:user');
      const storedToken = await AsyncStorage.getItem('@thinkcate:token');
      
      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Importar o serviço de autenticação
      const { authService } = await import('../services/authService');
      const response = await authService.login({ email, password });
      
      // Salvar no AsyncStorage
      await AsyncStorage.setItem('@thinkcate:user', JSON.stringify(response.user));
      await AsyncStorage.setItem('@thinkcate:token', response.token);
      
      setUser(response.user);
    } catch (error) {
      console.error('Erro no login:', error);
      throw new Error('Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Importar o serviço de autenticação
      const { authService } = await import('../services/authService');
      const response = await authService.register({ name, email, password });
      
      // Salvar no AsyncStorage
      await AsyncStorage.setItem('@thinkcate:user', JSON.stringify(response.user));
      await AsyncStorage.setItem('@thinkcate:token', response.token);
      
      setUser(response.user);
    } catch (error) {
      console.error('Erro no registro:', error);
      throw new Error('Erro ao criar conta. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('@thinkcate:user');
      await AsyncStorage.removeItem('@thinkcate:token');
      setUser(null);
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    try {
      if (user) {
        const updatedUser = { ...user, ...userData };
        await AsyncStorage.setItem('@thinkcate:user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  
  return context;
}
