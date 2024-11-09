import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

import  icon1 from './icons/icon1.png';
import  icon2 from './icons/icon2.png';
import  icon3 from './icons/icon3.png';
import  icon4  from './icons/icon4.png';
import icon5  from './icons/icon5.png';
import icon from './icons/icon.png';

const Navbar = () => {
  const [isMenuOpen, setMenuOpen] = React.useState(false);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="cute-navbar">
      <div className="navbar-logo">
        <NavLink to="/" onClick={closeMenu}>
          <img src={icon} alt="Logo" />
          <span>Cat Haven</span>
        </NavLink>
      </div>
      <button
        className="navbar-toggle"
        onClick={toggleMenu}
        aria-label="Toggle menu"
        aria-controls="navbar-menu"
        aria-expanded={isMenuOpen}
      >
        <img
          src={isMenuOpen ? icon2 : icon1}
          alt="Menu Icon"
          className="menu-icon"
        />
      </button>
      <ul
        id="navbar-menu"
        className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}
        role="menu"
      >
        <li>
          <NavLink to="/gallery" className="active-link" onClick={closeMenu}>
            <img src={icon3} alt="Cat Icon" className="nav-icon" /> Gallery
          </NavLink>
        </li>
        <li>
          <NavLink to="/about" className="active-link" onClick={closeMenu}>
            <img src={icon4} alt="Info Icon" className="nav-icon" /> About
          </NavLink>
        </li>
        <li>
          <NavLink to="/contact" className="active-link" onClick={closeMenu}>
            <img src={icon5} alt="Contact Icon" className="nav-icon" /> Contact
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;