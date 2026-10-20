import React, { useEffect, useRef } from 'react';
import { LuX, LuSun, LuMoon } from 'react-icons/lu';
import { FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import './MobileMenu.css';

const MobileMenu = ({ isMenuOpen, setIsMenuOpen, currentPage, onNavigate }) => {
  const { theme, toggleTheme } = useTheme();
  const navigatingRef = useRef(false);

  // Freeze the page behind the menu on mobile/iOS
  useEffect(() => {
    if (!isMenuOpen) {
      navigatingRef.current = false;
      return;
    }
    const scrollY = window.scrollY;
    document.body.classList.add('menu-open');
    document.body.style.top = `-${scrollY}px`;
    return () => {
      document.body.classList.remove('menu-open');
      document.body.style.top = '';
      if (!navigatingRef.current) {
        window.scrollTo({ top: scrollY, behavior: 'instant' });
      }
    };
  }, [isMenuOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isMenuOpen) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  const handleNavClick = (page, targetId) => (e) => {
    e.preventDefault();
    navigatingRef.current = true;
    closeMenu();
    setTimeout(() => {
      if (onNavigate) onNavigate(page, targetId);
    }, 60);
  };

  return (
    <div
      className={`mobile-menu-overlay ${isMenuOpen ? 'open' : ''} ${theme === 'light' ? 'light' : 'dark'}`}
      onClick={closeMenu}
      id="mobile-menu"
      aria-hidden={!isMenuOpen}
    >
      <button
        type="button"
        className="mobile-menu-close-btn"
        onClick={closeMenu}
        aria-label="Close menu"
      >
        <LuX size={30} />
      </button>

      <div className="mobile-menu-content" onClick={(e) => e.stopPropagation()}>
        {/* Header: Profile Avatar & Name */}
        <div className="mobile-menu-header">
          <a href="#" onClick={handleNavClick('home', 'top')} className="memoji-wrapper" aria-label="Home">
            <img src="/mrAbhimanyu.png" alt="Abhimanyu Vishwakarma" className="memoji" />
          </a>
          <h2 className="mobile-menu-name">Abhimanyu Vishwakarma</h2>
        </div>

        {/* Navigation Links */}
        <div className="mobile-menu-links">
          <a
            href="#about"
            className={currentPage === 'home' && (!window.location.hash || window.location.hash === '#' || window.location.hash === '#about') ? 'active' : ''}
            onClick={handleNavClick('home', 'about')}
          >
            About
          </a>
          <a
            href="#experience"
            onClick={handleNavClick('home', 'experience')}
          >
            Experience
          </a>
          <a
            href="#work"
            onClick={handleNavClick('home', 'work')}
          >
            Projects
          </a>
          <a
            href="#arcade"
            className={currentPage === 'arcade' ? 'active' : ''}
            onClick={handleNavClick('arcade')}
          >
            Arcade
          </a>
          <a
            href="#contact"
            className={currentPage === 'contact' ? 'active' : ''}
            onClick={handleNavClick('contact')}
          >
            Contact
          </a>
        </div>

        {/* Options Row: Theme Toggle & Language */}
        <div className="mobile-menu-options">
          <button
            type="button"
            className="mobile-theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {theme === 'light' ? <LuMoon size={22} /> : <LuSun size={22} />}
            <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
          </button>

          <div className="mobile-lang-picker" title="English">
            <span className="lang-flag" role="img" aria-label="English">🇬🇧</span>
            <span className="lang-arrow">▾</span>
          </div>
        </div>

        {/* Social Links */}
        <div className="mobile-menu-social">
          <a
            href="https://www.linkedin.com/in/mrabhimanyu/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <FaLinkedin size={32} />
          </a>
          <a
            href="https://github.com/mrAbhimanyuVishwakarma"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <FaGithub size={32} />
          </a>
          <a
            href="mailto:abhimanyuvishwakarma9228@gmail.com"
            aria-label="Email"
          >
            <FaEnvelope size={32} />
          </a>
        </div>

        {/* Copyright & Legal */}
        <div className="mobile-copyright-notice">
          <p>© 2026 Abhimanyu Vishwakarma. All rights reserved.</p>
          <div className="mobile-menu-legal">
            <a href="#privacy-policy" onClick={closeMenu}>Legal Notice</a>
            <a href="#privacy-policy" onClick={closeMenu}>Privacy Policy</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
