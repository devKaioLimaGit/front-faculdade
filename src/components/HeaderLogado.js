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

const HeaderLogado = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const handleLogout = () => {
    // Função de logout (adicionar lógica conforme necessário)
  };

  return (
    <>
      <header className="glass-header">
        <div className="logo" data-aos="zoom-in">
          <Link to="/">Cinemato<span>.Graphy</span></Link>
        </div>

        <nav className="nav-links">
          <Link to="/" data-aos="fade-down" data-aos-delay="100" onClick={handleLogout}>Logout</Link>
        </nav>

        {/* Botão hambúrguer */}
        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          data-aos="fade-left"
          data-aos-delay="500"
        >
          <FaBars />
        </button>
      </header>

      {/* Menu lateral mobile */}
      <aside className={`side-menu ${menuOpen ? 'open' : ''}`}>
        <button
          className="close-btn"
          onClick={() => setMenuOpen(false)}
          data-aos="fade-left"
        >
          <FaTimes />
        </button>
        <Link to="/" onClick={handleLogout} data-aos="fade-right" data-aos-delay="100">Logout</Link>
      </aside>

      {/* Overlay escuro atrás do menu */}
      {menuOpen && <div className="menu-overlay" onClick={() => setMenuOpen(false)}></div>}
    </>
  );
};

export default HeaderLogado;
