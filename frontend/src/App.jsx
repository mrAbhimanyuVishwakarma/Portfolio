import { useState, useEffect, useRef, useCallback } from 'react';
import { useTheme } from './context/ThemeContext';
import './index.css';
import Navbar from './components/Navbar';
import MobileMenu from './components/MobileMenu';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Contact from './components/Contact';
import ContactPage from './pages/ContactPage';
import Footer from './components/Footer';
import SocialSidebar from './components/SocialSidebar';
import Football from './components/Football';
import Arcade from './components/Arcade';
import LegalModal from './components/LegalModal';
import Lenis from 'lenis';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const lenisRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(() => {
    if (typeof window !== 'undefined') {
      const validHashes = new Set(['', '#', '#about', '#experience', '#work', '#arcade', '#contact']);
      const isUnknownPath = window.location.pathname !== '/' && window.location.pathname !== '';
      const isUnknownHash = !validHashes.has(window.location.hash);
      if (isUnknownPath || isUnknownHash) {
        return 'home';
      }
      if (window.location.hash === '#arcade') return 'arcade';
      if (window.location.hash === '#contact') return 'contact';
    }
    return 'home';
  });

  // Auto-Redirect Unknown URLs & Hashes to Home
  useEffect(() => {
    const validHashes = new Set(['', '#', '#about', '#experience', '#work', '#arcade', '#contact']);
    const isUnknownPath = window.location.pathname !== '/' && window.location.pathname !== '';
    const isUnknownHash = !validHashes.has(window.location.hash);

    if (isUnknownPath || isUnknownHash) {
      window.history.replaceState(null, '', '/');
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { duration: 0.5 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, []);
  
  const { theme } = useTheme();
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);

  // Light-mode background video paths
  const LIGHT_MODE_VIDEO_WEBM = '';
  const LIGHT_MODE_VIDEO_MP4 = '/Background/Web/2.f1-wallpaper_light.mp4';
  const hasLightVideo = Boolean(LIGHT_MODE_VIDEO_WEBM || LIGHT_MODE_VIDEO_MP4);

  // Navigation handler
  const handleNavigate = useCallback((page, targetId) => {
    if (page === 'arcade') {
      setCurrentPage('arcade');
      window.location.hash = '#arcade';
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { duration: 0.8 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (page === 'contact') {
      setCurrentPage('contact');
      window.location.hash = '#contact';
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { duration: 0.8 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      setCurrentPage('home');
      if (targetId === 'work' || targetId === 'experience' || targetId === 'about' || targetId === 'privacy-policy') {
        window.location.hash = `#${targetId}`;
        setTimeout(() => {
          const targetElement = document.getElementById(targetId);
          if (targetElement) {
            const navbarHeight = document.querySelector('nav')?.offsetHeight || 62;
            if (lenisRef.current) {
              lenisRef.current.scrollTo(targetElement, { offset: -navbarHeight, duration: 1.0 });
            } else {
              targetElement.scrollIntoView({ behavior: 'smooth' });
            }
          }
        }, 80);
      } else {
        if (window.location.hash && window.location.hash !== '') {
          window.history.pushState(null, '', window.location.pathname);
        }
        if (lenisRef.current) {
          lenisRef.current.scrollTo(0, { duration: 0.8 });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    }
  }, []);

  const handleNavigateRef = useRef(handleNavigate);
  useEffect(() => {
    handleNavigateRef.current = handleNavigate;
  }, [handleNavigate]);

  // Monitor background video play/pause state
  useEffect(() => {
    const video = document.querySelector('.video-bg');
    if (!video) return;

    const handlePlay = () => setIsVideoPlaying(true);
    const handlePause = () => setIsVideoPlaying(false);

    requestAnimationFrame(() => {
      if (video) setIsVideoPlaying(!video.paused);
    });

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [theme]);

  // Sync body.video-paused class to show the crisp geometric grid & animated mesh
  useEffect(() => {
    if (!isVideoPlaying) {
      document.body.classList.add('video-paused');
    } else {
      document.body.classList.remove('video-paused');
    }
  }, [isVideoPlaying]);

  useEffect(() => {
    // Lenis Smooth Scroll Setup
    const lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
    });
    lenisRef.current = lenisInstance;

    let rafId;
    function raf(time) {
      lenisInstance.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Dynamic SEO Metadata Injection
    document.title = "Abhimanyu Vishwakarma — Software Development Engineer & Systems Builder";

    // Scroll Observer for active nav items
    const sections = document.querySelectorAll('.section');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === entry.target.id) {
              link.classList.add('active');
            }
          });
        }
      });
    }, { threshold: 0.5 });
    sections.forEach(section => observer.observe(section));

    // Reveal Observer
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    sections.forEach(section => revealObserver.observe(section));

    // Scroll to Top & Autohide Navbar Logic using Lenis hook
    let navElement = document.querySelector('nav');
    let scrollState = false;
    
    const handleLenisScroll = (e) => {
      const currentScrollY = e.scroll;
      
      const shouldShowScroll = currentScrollY > 400;
      if (shouldShowScroll !== scrollState) {
        scrollState = shouldShowScroll;
        setShowScrollTop(shouldShowScroll);
      }

      if (!navElement) navElement = document.querySelector('nav');
      if (navElement) {
        navElement.classList.remove('nav--hidden');
      }
    };
    lenisInstance.on('scroll', handleLenisScroll);

    // Anchor Link Interceptor for Smooth Scroll & Routing
    const handleAnchorClick = (e) => {
      const targetLink = e.target.closest('a');
      if (!targetLink) return;
      
      const href = targetLink.getAttribute('href');
      if (!href) return;

      if (href === '#arcade') {
        e.preventDefault();
        handleNavigateRef.current('arcade');
        return;
      }

      if (href === '#contact') {
        e.preventDefault();
        handleNavigateRef.current('contact');
        return;
      }

      if (href === '#work') {
        e.preventDefault();
        handleNavigateRef.current('home', 'work');
        return;
      }

      if (href === '#experience') {
        e.preventDefault();
        handleNavigateRef.current('home', 'experience');
        return;
      }

      if (href === '#' || href === '') {
        e.preventDefault();
        handleNavigateRef.current('home', 'top');
        return;
      }

      if (href.startsWith('#')) {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          const navbarHeight = document.querySelector('nav')?.offsetHeight || 62;
          lenisInstance.scrollTo(targetElement, { 
            offset: -navbarHeight, 
            duration: 1.2 
          });
        }
      }
    };
    document.addEventListener('click', handleAnchorClick);

    // Sync hash changes (e.g. browser back/forward buttons)
    const handleHashSync = () => {
      const validHashes = new Set(['', '#', '#about', '#experience', '#work', '#arcade', '#contact']);
      const hash = window.location.hash;
      if (!validHashes.has(hash)) {
        setCurrentPage('home');
        window.history.replaceState(null, '', '/');
        if (lenisRef.current) {
          lenisRef.current.scrollTo(0, { duration: 0.5 });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        return;
      }
      if (hash === '#arcade') {
        setCurrentPage('arcade');
      } else if (hash === '#contact') {
        setCurrentPage('contact');
      } else {
        setCurrentPage('home');
      }
    };
    window.addEventListener('hashchange', handleHashSync);

    // Device Capability Checks
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    
    // Cached Bounding Rects
    const cachedRects = new Map();

    const handleHoverEnter = (e) => {
      cachedRects.set(e.currentTarget, e.currentTarget.getBoundingClientRect());
    };

    const handleHoverLeave = (e) => {
      cachedRects.delete(e.currentTarget);
      e.currentTarget.style.transform = '';
    };

    // Magnetic Button Effect (Desktop only)
    const handleMagneticMove = (e) => {
      const el = e.currentTarget;
      const rect = cachedRects.get(el) || el.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * 0.25;
      const y = (e.clientY - rect.top - rect.height / 2) * 0.25;
      el.style.transform = `translate(${x}px, ${y}px)`;
    };

    // 3D Tilt Effect (Desktop only)
    const handleTiltMove = (e, factorX, factorY) => {
      const el = e.currentTarget;
      const rect = cachedRects.get(el) || el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * factorX; 
      const rotateY = ((x - centerX) / centerX) * factorY;
      
      el.style.setProperty('--mouse-x', `${x}px`);
      el.style.setProperty('--mouse-y', `${y}px`);
      el.style.transform = `perspective(1000px) scale3d(1.04, 1.04, 1.04) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const handleTiltLeave = (e) => {
      cachedRects.delete(e.currentTarget);
      e.currentTarget.style.transform = 'perspective(1000px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg)';
    };

    // Parallax Window Effect for Project Images (Desktop only)
    const handleWindowParallax = (e) => {
      const el = e.currentTarget;
      const img = el.querySelector('img');
      if (!img) return;

      const rect = cachedRects.get(el) || el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -6; 
      const rotateY = ((x - centerX) / centerX) * 6;
      const translateX = ((x - centerX) / centerX) * -3;
      const translateY = ((y - centerY) / centerY) * -3;
      
      img.style.transform = `scale3d(1.03, 1.03, 1.03) translate3d(${translateX}px, ${translateY}px, 0) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const handleWindowLeave = (e) => {
      cachedRects.delete(e.currentTarget);
      const img = e.currentTarget.querySelector('img');
      if (img) img.style.transform = '';
    };

    const magneticElements = document.querySelectorAll('.btn-primary, .btn-ghost, .nav-logo');
    const projectImageContainers = document.querySelectorAll('.project-image-container');
    const certCards = document.querySelectorAll('.cert-card');
    const contactItems = document.querySelectorAll('.contact-item');

    if (!isTouchDevice) {
      magneticElements.forEach(el => {
        el.addEventListener('mouseenter', handleHoverEnter);
        el.addEventListener('mousemove', handleMagneticMove);
        el.addEventListener('mouseleave', handleHoverLeave);
      });

      projectImageContainers.forEach(container => {
        container.addEventListener('mouseenter', handleHoverEnter);
        container.addEventListener('mousemove', handleWindowParallax);
        container.addEventListener('mouseleave', handleWindowLeave);
      });

      certCards.forEach(card => {
        card.addEventListener('mouseenter', handleHoverEnter);
        card.addEventListener('mousemove', (e) => handleTiltMove(e, -8, 8));
        card.addEventListener('mouseleave', handleTiltLeave);
      });

      contactItems.forEach(item => {
        item.addEventListener('mouseenter', handleHoverEnter);
        item.addEventListener('mousemove', (e) => handleTiltMove(e, -6, 4));
        item.addEventListener('mouseleave', handleTiltLeave);
      });
    }

    // Cleanup
    return () => {
      cancelAnimationFrame(rafId);
      lenisInstance.destroy();
      document.removeEventListener('click', handleAnchorClick);
      window.removeEventListener('hashchange', handleHashSync);
      sections.forEach(section => observer.unobserve(section));
      sections.forEach(section => revealObserver.unobserve(section));

      if (!isTouchDevice) {
        magneticElements.forEach(el => {
          el.removeEventListener('mouseenter', handleHoverEnter);
          el.removeEventListener('mousemove', handleMagneticMove);
          el.removeEventListener('mouseleave', handleHoverLeave);
        });

        projectImageContainers.forEach(container => {
          container.removeEventListener('mouseenter', handleHoverEnter);
          container.removeEventListener('mousemove', handleWindowParallax);
          container.removeEventListener('mouseleave', handleWindowLeave);
        });

        certCards.forEach(card => {
          card.removeEventListener('mouseenter', handleHoverEnter);
          card.removeEventListener('mouseleave', handleTiltLeave);
        });

        contactItems.forEach(item => {
          item.removeEventListener('mouseenter', handleHoverEnter);
          item.removeEventListener('mouseleave', handleTiltLeave);
        });
      }
    };
  }, []);

  const scrollToTop = () => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Dynamic Animated Mesh Gradient & Geometric Grid Overlay */}
      <div className={`dynamic-mesh-bg ${theme === 'light' ? 'light' : 'dark'}`} />
      <div className={`dynamic-grid-overlay ${theme === 'light' ? 'light' : 'dark'}`} />

      <video 
        key={theme} 
        className={`video-bg ${!isVideoPlaying ? 'video-paused' : ''}`} 
        autoPlay 
        loop 
        muted 
        playsInline 
        poster={theme === 'light' && hasLightVideo ? "/Background/Mobile/2.mobile_light.jpg" : "/Background/Mobile/1.mobile_dark.jpg"}
      >
        {theme === 'light' && hasLightVideo ? (
          <>
            {LIGHT_MODE_VIDEO_WEBM && <source src={LIGHT_MODE_VIDEO_WEBM} type="video/webm" />}
            {LIGHT_MODE_VIDEO_MP4 && <source src={LIGHT_MODE_VIDEO_MP4} type="video/mp4" />}
          </>
        ) : (
          <>
            <source src="/Background/Web/1.f1-wallpaper_dark.mp4" type="video/mp4" />
          </>
        )}
      </video>

      <Navbar 
        isMenuOpen={isMenuOpen} 
        setIsMenuOpen={setIsMenuOpen} 
        currentPage={currentPage}
        onNavigate={handleNavigate}
      />
      <MobileMenu 
        isMenuOpen={isMenuOpen} 
        setIsMenuOpen={setIsMenuOpen} 
        currentPage={currentPage}
        onNavigate={handleNavigate}
        openLegalModal={() => setIsLegalModalOpen(true)}
      />
      
      <SocialSidebar />
      
      {currentPage === 'home' ? (
        <>
          <div className="divider"><hr /></div>
          <Contact onNavigate={handleNavigate} openLegalModal={() => setIsLegalModalOpen(true)} />
          
          <div className="divider"><hr /></div>
          <Experience />

          <div className="divider"><hr /></div>
          <Projects />
          
          <Football />
        </>
      ) : currentPage === 'contact' ? (
        <ContactPage onNavigate={handleNavigate} />
      ) : (
        <Arcade onNavigate={handleNavigate} />
      )}
      
      <Footer 
        onNavigate={handleNavigate}
        openLegalModal={() => setIsLegalModalOpen(true)} 
      />

      <LegalModal 
        isOpen={isLegalModalOpen} 
        onClose={() => setIsLegalModalOpen(false)} 
      />

      <button 
        id="scroll-to-top" 
        className={`scroll-to-top ${showScrollTop ? 'show' : ''}`} 
        aria-label="Scroll to top"
        onClick={scrollToTop}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
      </button>
    </>
  );
}

export default App;
