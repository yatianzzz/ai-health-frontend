import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  username: string | null;
  isInitialized: boolean;
  login: (token: string, username: string) => void;
  logout: () => void;
  checkAuth: () => boolean;
}

const defaultContext: AuthContextType = {
  isAuthenticated: false,
  token: null,
  username: null,
  isInitialized: false,
  login: () => {},
  logout: () => {},
  checkAuth: () => false
};

const AuthContext = createContext<AuthContextType>(defaultContext);

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // 检查本地存储中是否有token
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');

    if (storedToken) {
      setToken(storedToken);
      setUsername(storedUsername);
      setIsAuthenticated(true);
    }

    // Mark initialization as complete
    setIsInitialized(true);
  }, []);
  
  // 登录方法
  const login = (newToken: string, newUsername: string) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('username', newUsername);
    setToken(newToken);
    setUsername(newUsername);
    setIsAuthenticated(true);
  };
  
  // 登出方法
  const logout = () => {
    // 清除本地存储
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('profileComplete');
    localStorage.removeItem('userProfile');
    
    // 重置状态
    setToken(null);
    setUsername(null);
    setIsAuthenticated(false);
  };
  
  // 检查认证状态
  const checkAuth = (): boolean => {
    const storedToken = localStorage.getItem('token');
    return !!storedToken;
  };
  
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        token,
        username,
        isInitialized,
        login,
        logout,
        checkAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 