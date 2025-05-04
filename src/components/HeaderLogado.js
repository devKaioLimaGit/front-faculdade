import React from 'react';
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import Cookies from "js-cookie";
import './Header.css';

const HeaderLogado = () => {

      const navigate = useNavigate();
  
  
  

      const handleLogout = () => {
          Cookies.remove('token');
          navigate('/signin');
      };
  return (
    <header className="glass-header">
      <div className="logo">
        <Link to="/">🎬 MeuApp</Link>
      </div>
      <nav className="nav-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/movie">Filmes</Link>
         <Link to="/" onClick={handleLogout}>Logout</Link>
      </nav>
    </header>
  );
};

export default HeaderLogado;
