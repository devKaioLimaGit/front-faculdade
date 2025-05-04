import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="glass-header">
      <div className="logo">
        <Link to="/">🎬 MeuApp</Link>
      </div>
      <nav className="nav-links">
        {/* <Link to="/dashboard">Dashboard</Link>
        <Link to="/movie">Filmes</Link> */}
         <Link to="/">Avaliação</Link>
      </nav>
    </header>
  );
};

export default Header;
