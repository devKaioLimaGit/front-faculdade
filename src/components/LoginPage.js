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
        navigate('/api');  // Redireciona para o dashboard
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
        <div className="login-box" data-aos="fade-up">
          <h2 className="login-title" data-aos="zoom-in" data-aos-delay="100">
            Acesse sua conta para explorar nossa API!
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-input"
              data-aos="fade-right"
              data-aos-delay="200"
            />
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
              data-aos="fade-left"
              data-aos-delay="300"
            />
            <button
              type="submit"
              className="login-button"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>

    </>
  );

};

export default LoginPage;
