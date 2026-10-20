import ThemeToggle from './ThemeToggle';

const Navbar = ({ isMenuOpen, setIsMenuOpen, currentPage, onNavigate }) => {
  const handleScrollTop = (e) => {
    e.preventDefault();
    if (window.location.hash && window.location.hash !== '') {
      window.history.pushState(null, '', window.location.pathname);
    }
    if (onNavigate) {
      onNavigate('home', 'top');
    }
  };

  return (
    <nav className={isMenuOpen ? 'nav--hidden' : ''}>
      <a 
        className="nav-title" 
        href="#" 
        onClick={handleScrollTop}
      >
        Abhimanyu Vishwakarma
      </a>
      <ul className="nav-links">
        <li>
          <a 
            href="#about" 
            onClick={(e) => {
              e.preventDefault();
              if (onNavigate) onNavigate('home', 'about');
            }}
          >
            About
          </a>
        </li>
        <li>
          <a 
            href="#experience" 
            onClick={(e) => {
              e.preventDefault();
              if (onNavigate) onNavigate('home', 'experience');
            }}
          >
            Experience
          </a>
        </li>
        <li>
          <a 
            href="#work" 
            onClick={(e) => {
              e.preventDefault();
              if (onNavigate) onNavigate('home', 'work');
            }}
          >
            Projects
          </a>
        </li>
        <li>
          <a 
            href="#arcade" 
            className={currentPage === 'arcade' ? 'active' : ''}
            onClick={(e) => {
              e.preventDefault();
              if (onNavigate) onNavigate('arcade');
            }}
          >
            Arcade
          </a>
        </li>
        <li>
          <a 
            href="#contact" 
            className={currentPage === 'contact' ? 'active' : ''}
            onClick={(e) => {
              e.preventDefault();
              if (onNavigate) onNavigate('contact');
            }}
          >
            Contact
          </a>
        </li>
      </ul>
      <ThemeToggle />
      <button 
        className="nav-toggle" 
        type="button" 
        aria-expanded={isMenuOpen} 
        aria-controls="mobile-menu" 
        aria-label="Open menu"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <img className="nav-toggle-avatar" src="/mrAbhimanyu.png" alt="Open menu" width="24" height="24" />
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M4 7h16"></path>
          <path d="M4 12h16"></path>
          <path d="M4 17h16"></path>
        </svg>
      </button>
      <a 
        className="nav-logo" 
        href="#" 
        aria-label="Abhimanyu Vishwakarma home"
        onClick={handleScrollTop}
      >
        <img className="nav-avatar" src="/mrAbhimanyu.png" alt="Abhimanyu Vishwakarma" width="36" height="36" />
      </a>
    </nav>
  );
};

export default Navbar;
