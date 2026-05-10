import React from 'react';

const MobileMenu = ({ isMenuOpen, setIsMenuOpen }) => {
  return (
    <div className={`mobile-menu ${isMenuOpen ? 'is-open' : ''}`} id="mobile-menu" aria-hidden={!isMenuOpen}>
      <a href="#experience" onClick={() => setIsMenuOpen(false)}>Experience</a>
      <a href="#skills" onClick={() => setIsMenuOpen(false)}>Skills</a>
      <a href="#projects" onClick={() => setIsMenuOpen(false)}>Projects</a>
      <a href="#contact" onClick={() => setIsMenuOpen(false)}>Contact</a>
      <p className="mobile-menu-meta">Backend Engineer • Open to opportunities</p>
    </div>
  );
};

export default MobileMenu;
