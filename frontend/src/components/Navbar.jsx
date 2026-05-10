import React from 'react';

const Navbar = ({ isMenuOpen, setIsMenuOpen }) => {
  return (
    <nav className={isMenuOpen ? 'nav--hidden' : ''}>
      <a className="nav-title" href="#">Abhimanyu Vishwakarma</a>
      <ul className="nav-links">
        <li><a href="#experience">Experience</a></li>
        <li><a href="#skills">Skills</a></li>
        <li><a href="#projects">Projects</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
      <button 
        className="nav-toggle" 
        type="button" 
        aria-expanded={isMenuOpen} 
        aria-controls="mobile-menu" 
        aria-label="Open menu"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <img className="nav-toggle-avatar" src="./mrAbhimanyu.png" alt="Open menu" />
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M4 7h16"></path>
          <path d="M4 12h16"></path>
          <path d="M4 17h16"></path>
        </svg>
      </button>
      <a className="nav-logo" href="#" aria-label="Abhimanyu Vishwakarma home">
        <img className="nav-avatar" src="./mrAbhimanyu.png" alt="Abhimanyu Vishwakarma" />
      </a>
    </nav>
  );
};

export default Navbar;
