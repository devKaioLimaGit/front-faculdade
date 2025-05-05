import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../utils/api'; // Importando a instância da API configurada
import Cookies from 'js-cookie'; // Importando js-cookie para acessar o cookie
import "./LoadingSpinner.css"

const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = Cookies.get('token'); // Recuperando o token do cookie

      if (!token) {
        setIsAuthenticated(false); // Se não houver token, não está autenticado
        return;
      }

      try {
        const response = await api.get('/me', {
          headers: {
            Authorization: `Bearer ${token}`, // Enviando o token no cabeçalho Authorization
          },
        });
        if (response.data) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" />; // Redireciona para a página de login se não estiver autenticado
  }

  return children; // Se estiver autenticado, exibe os filhos (componente protegido)
};

export default PrivateRoute;
