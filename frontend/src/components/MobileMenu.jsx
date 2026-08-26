import React from 'react';

const MobileMenu = ({ isMenuOpen, setIsMenuOpen }) => {
  const handleResumeDownload = (e) => {
    e.preventDefault();
    const link = document.createElement('a');
    link.href = '/AbhimanyuVishwakarma_Resume.pdf';
    link.download = 'Abhimanyu_Vishwakarma_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsMenuOpen(false);
  };

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
      <a href="/AbhimanyuVishwakarma_Resume.pdf" onClick={handleResumeDownload}>Resume</a>
      <a href="#work" onClick={() => setIsMenuOpen(false)}>My Work</a>

      <div className="mobile-menu-divider"></div>

      <a href="https://www.linkedin.com/in/mrabhimanyu/" target="_blank" rel="noopener noreferrer" onClick={() => setIsMenuOpen(false)}>LinkedIn</a>
      <a href="https://github.com/mrAbhimanyuVishwakarma" target="_blank" rel="noopener noreferrer" onClick={() => setIsMenuOpen(false)}>GitHub</a>
      <a href="mailto:abhimanyuvishwakarma9228@gmail.com" onClick={() => setIsMenuOpen(false)}>MailId</a>

      <div className="mobile-menu-divider"></div>

      <a href="#privacy-policy" onClick={() => setIsMenuOpen(false)}>Privacy Policy</a>
    </div>
  );
};

export default MobileMenu;
