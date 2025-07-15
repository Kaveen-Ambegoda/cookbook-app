'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode';

interface JwtPayload {
  sub: string;
  userId?: string;
  role?: string;
  exp?: number;
  [key: string]: any;
}

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  userId: string | null;
  role: string | null;
  token: string | null;            // renamed from accessToken
  refreshToken: string | null;
  login: (token: string, refreshToken: string) => void;
  logout: () => void;
  updateToken: (newToken: string) => void;  // renamed from updateAccessToken
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [username, setUsername] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);           // renamed from accessToken
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  const decodeAndSetUser = (jwt: string) => {
    try {
      const decoded = jwtDecode<JwtPayload>(jwt);

      const NAME_CLAIM = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name";
      const ID_CLAIM = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";
      const ROLE_CLAIM = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

      setUsername(decoded[NAME_CLAIM] || null);
      setUserId(decoded[ID_CLAIM] || null);
      setRole(decoded[ROLE_CLAIM] || null);
      setIsAuthenticated(true);
    } catch {
      logout();
    }
  };

  const loadTokens = () => {
    const storedToken = localStorage.getItem('token');
    const storedRefresh = localStorage.getItem('refreshToken');
    if (storedToken && storedRefresh) {
      setToken(storedToken);
      setRefreshToken(storedRefresh);
      decodeAndSetUser(storedToken);
    } else {
      setIsAuthenticated(false);
    }
  };

  const login = (newToken: string, newRefreshToken: string) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('refreshToken', newRefreshToken);
    setToken(newToken);
    setRefreshToken(newRefreshToken);
    decodeAndSetUser(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setToken(null);
    setRefreshToken(null);
    setIsAuthenticated(false);
    setUsername(null);
    setUserId(null);
    setRole(null);
  };

  const updateToken = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    decodeAndSetUser(newToken);
  };

  useEffect(() => {
    loadTokens();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        username,
        userId,
        role,
        token,
        refreshToken,
        login,
        logout,
        updateToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
