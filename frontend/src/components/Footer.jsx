import { FaLinkedinIn, FaGithub, FaXTwitter, FaInstagram, FaEnvelope } from 'react-icons/fa6';
import './Footer.css';

const Footer = ({ onNavigate, openLegalModal }) => {
  const handleNav = (page, targetId) => (e) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(page, targetId);
    }
  };

  return (
    <footer className="site-footer">
      <div className="footer-container">
        {/* Top Row: Brand Info, Navigation Links, Social Icons */}
        <div className="footer-top-row">
          <div className="footer-brand">
            <h2 
              className="footer-title"
              onClick={handleNav('home', 'top')}
              role="button"
              tabIndex={0}
              aria-label="Back to home top"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleNav('home', 'top')(e);
                }
              }}
            >
              Abhimanyu Vishwakarma
            </h2>
            <p className="footer-subtitle">Building scalable systems and digital solutions</p>
          </div>

          <nav className="footer-nav" aria-label="Footer Navigation">
            <a 
              href="#about" 
              onClick={handleNav('home', 'about')}
            >
              About
            </a>
            <a 
              href="#experience" 
              onClick={handleNav('home', 'experience')}
            >
              Experience
            </a>
            <a 
              href="#work" 
              onClick={handleNav('home', 'work')}
            >
              Projects
            </a>
            <a 
              href="#arcade" 
              onClick={handleNav('arcade')}
            >
              Arcade
            </a>
            <a 
              href="#contact" 
              onClick={handleNav('contact')}
            >
              Contact
            </a>
          </nav>

          <div className="footer-socials" aria-label="Social Profiles">
            <a 
              href="https://www.linkedin.com/in/mrabhimanyu/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="footer-social-btn" 
              aria-label="LinkedIn Profile"
            >
              <FaLinkedinIn aria-hidden="true" />
            </a>
            <a 
              href="https://github.com/mrAbhimanyuVishwakarma" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="footer-social-btn" 
              aria-label="GitHub Profile"
            >
              <FaGithub aria-hidden="true" />
            </a>
            <a 
              href="https://x.com/mrAbhimanyu07" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="footer-social-btn" 
              aria-label="X (Twitter) Profile"
            >
              <FaXTwitter aria-hidden="true" />
            </a>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="footer-social-btn" 
              aria-label="Instagram Profile"
            >
              <FaInstagram aria-hidden="true" />
            </a>
            <a 
              href="mailto:abhimanyuvishwakarma9228@gmail.com" 
              className="footer-social-btn" 
              aria-label="Send Direct Email"
            >
              <FaEnvelope aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* Crisp Horizontal Divider */}
        <div className="footer-divider" role="separator" />

        {/* Bottom Row: Copyright, Legal Links, Location */}
        <div className="footer-bottom-row">
          <div className="footer-copyright">
            © 2026 Abhimanyu Vishwakarma. All rights reserved.
          </div>

          <div className="footer-legal-links">
            <button
              type="button"
              className="footer-legal-btn"
              onClick={openLegalModal}
              aria-label="Open Legal Notice modal"
            >
              Legal Notice
            </button>
            <button
              type="button"
              className="footer-legal-btn"
              onClick={openLegalModal}
              aria-label="Open Privacy Policy modal"
            >
              Privacy Policy
            </button>
          </div>

          <div className="footer-location">
            Made in Bengaluru, India 🇮🇳
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
