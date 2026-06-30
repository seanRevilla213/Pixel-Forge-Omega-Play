import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import api, { setAccessToken } from '../api/axiosInstance';
import type { User, AuthResponse } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, recaptchaToken?: string) => Promise<void>;
  register: (email: string, username: string, password: string, recaptchaToken?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleAuthResponse = useCallback((data: AuthResponse) => {
    setAccessToken(data.accessToken);
    setUser(data.user);
  }, []);

  // Try to restore session on mount
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const { data } = await api.post('/auth/refresh');
        setAccessToken(data.accessToken);
        // Fetch profile
        const profile = await api.get('/auth/profile');
        setUser(profile.data.user);
      } catch {
        setAccessToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    restoreSession();

    // Listen for forced logout
    const handleLogout = () => {
      setAccessToken(null);
      setUser(null);
    };
    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, []);

  const login = useCallback(async (email: string, password: string, recaptchaToken?: string) => {
    const { data } = await api.post('/auth/login', { email, password, recaptchaToken });
    handleAuthResponse(data);
  }, []);

  const register = useCallback(async (email: string, username: string, password: string, recaptchaToken?: string) => {
    const { data } = await api.post('/auth/register', { email, username, password, recaptchaToken });
    handleAuthResponse(data);
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch { /* ignore */ }
    setAccessToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
