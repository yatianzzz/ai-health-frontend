import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { message } from 'antd';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, checkAuth } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    if (!checkAuth()) {
      message.error('Please login first');
    }
  }, [checkAuth]);
  
  if (!isAuthenticated && !checkAuth()) {
    // 如果未认证，重定向到登录页面，并记住当前路径
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute; 