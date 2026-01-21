import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, authReady, loading } = useAuth();

  // Aguarda carregamento inicial e também loading de login
  if (!authReady || loading) {
    return  <>
                <div className="spinner"></div>
                Carregando...
              </>;
  }

  // Verifica também diretamente o localStorage para evitar race condition
  const tokenFromStorage = localStorage.getItem('token');
  if (!isAuthenticated && !tokenFromStorage) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;

