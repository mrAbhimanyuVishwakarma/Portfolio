import React from 'react';

const MobileMenu = ({ isMenuOpen, setIsMenuOpen }) => {
  return (
    <div className={`mobile-menu ${isMenuOpen ? 'is-open' : ''}`} id="mobile-menu" aria-hidden={!isMenuOpen}>
      <button 
        className="mobile-menu-close" 
        type="button" 
        aria-label="Close menu"
        onClick={() => setIsMenuOpen(false)}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <a href="#" onClick={() => setIsMenuOpen(false)}>Home</a>
      <a href="#work" onClick={() => setIsMenuOpen(false)}>My Work</a>
      <p className="mobile-menu-meta">Backend Engineer • Open to opportunities</p>
    </div>
  );
};

export default MobileMenu;
