import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './LoginPage.css';
import api from '../utils/api';
import Cookies from 'js-cookie'; // Importando a biblioteca
import Header from './Header';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await api.post('/session', {
        email,
        password
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Verifica se o login foi bem-sucedido
      if (response.status === 200) {
        console.log("eu não estou aqui")
        // Armazena o token no cookie
        Cookies.set('token', response.data.token, { expires: 1 }); // O cookie expira em 1 dia

        toast.success('Login realizado com sucesso!');
        navigate('/movie');  // Redireciona para o dashboard
      } else {
        toast.error(response.data.error || 'Erro no login');
      }
    } catch (error) {
      toast.error('Usuário não registrado!');
    }
  };

  return (
    <>
      <Header />
      <div className="login-container">
        <div className="overlay"></div>
        <div className="login-box">
          <h2 className="login-title">Login</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault(); // Impede o comportamento padrão de recarregar a página
              handleLogin(); // Chama a função de login
            }}
          >
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-input"
            />
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
            />
            <button type="submit" className="login-button">
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
  
};

export default LoginPage;
