import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} MeuApp. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
