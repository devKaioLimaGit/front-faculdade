import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import {
  FaFilm,
  FaStar,
  FaSignInAlt,
  FaUserPlus,
  FaBars,
  FaTimes
} from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <>
      <header className="glass-header">
        <div className="logo" data-aos="zoom-in">
          <Link to="/">Cinemato<span>.Graphy</span></Link>
        </div>

        <nav className="nav-links">
          <Link to="/" data-aos="fade-down" data-aos-delay="100"><FaFilm /> Filmes</Link>
          <Link to="/assessment" data-aos="fade-down" data-aos-delay="200"><FaStar /> Avaliação</Link>
          <Link to="/signin" data-aos="fade-down" data-aos-delay="300"><FaSignInAlt /> Entrar</Link>
          <Link to="/signup" data-aos="fade-down" data-aos-delay="400"><FaUserPlus /> Cadastre-se</Link>
        </nav>

        {/* Botão hambúrguer */}
        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          data-aos="fade-left"
          data-aos-delay="500"
        >
          <FaBars /> {/* Ícone do menu hambúrguer */}
        </button>
      </header>

      {/* Menu lateral mobile */}
      <aside className={`side-menu ${menuOpen ? 'open' : ''}`}>
        <button
          className="close-btn"
          onClick={() => setMenuOpen(false)}
          data-aos="fade-left"
        >
          <FaTimes /> {/* Ícone de fechar */}
        </button>
        <Link to="/" onClick={() => setMenuOpen(false)} data-aos="fade-right" data-aos-delay="100"><FaFilm /> Filmes</Link>
        <Link to="/assessment" onClick={() => setMenuOpen(false)} data-aos="fade-right" data-aos-delay="200"><FaStar /> Avaliação</Link>
        <Link to="/signin" onClick={() => setMenuOpen(false)} data-aos="fade-right" data-aos-delay="300"><FaSignInAlt /> Entrar</Link>
        <Link to="/signup" onClick={() => setMenuOpen(false)} data-aos="fade-right" data-aos-delay="400"><FaUserPlus /> Cadastre-se</Link>
      </aside>

      {/* Overlay escuro atrás do menu */}
      {menuOpen && <div className="menu-overlay" onClick={() => setMenuOpen(false)}></div>}
    </>
  );
};

export default Header;
