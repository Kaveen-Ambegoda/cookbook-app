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

interface UserType {
  email: string | null;
  username: string | null;
  userId: string | null;
  role: string | null;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserType | null;
  token: string | null;            
  refreshToken: string | null;
  login: (token: string, refreshToken: string) => void;
  logout: () => void;
  updateToken: (newToken: string) => void;  
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);           
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  const decodeAndSetUser = (jwt: string) => {
    try {
      const decoded = jwtDecode<JwtPayload>(jwt);

      // Try these common claims for email
      const EMAIL_CLAIM = decoded.email || decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] || decoded.sub || null;

      setUser({
        email: EMAIL_CLAIM,
        username: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || null,
        userId: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || null,
        role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || null,
      });
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
    setUser(null);
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
        user,
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
