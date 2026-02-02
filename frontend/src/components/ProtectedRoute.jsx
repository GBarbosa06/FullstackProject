import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Wait for any ongoing login/loading operations
  if (loading) {
    return (
      <>
        <div className="spinner"></div>
        Carregando...
      </>
    );
  }

  // Check token directly from localStorage to avoid race conditions
  const tokenFromStorage = localStorage.getItem('token');
  if (!isAuthenticated && !tokenFromStorage) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;

