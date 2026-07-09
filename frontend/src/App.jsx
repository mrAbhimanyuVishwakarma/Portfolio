import React, { useState, useEffect } from 'react';
import './index.css';
import Navbar from './components/Navbar';
import MobileMenu from './components/MobileMenu';
import Hero from './components/Hero';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import SocialSidebar from './components/SocialSidebar';
import Certificates from './components/Certificates';
import Education from './components/Education';
import Football from './components/Football';
import Lenis from 'lenis';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [lenis, setLenis] = useState(null);

  useEffect(() => {
    // Lenis Smooth Scroll Setup
    const lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
    });
    setLenis(lenisInstance);

    let rafId;
    function raf(time) {
      lenisInstance.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Theme setup
    const themes = ['theme-racing-bulls', 'theme-alpine'];
    const selectedTheme = themes[Math.floor(Math.random() * themes.length)];
    document.documentElement.classList.add(selectedTheme);

    // Dynamic SEO Metadata Injection (Hides details from Ctrl+U View Source)
    document.title = "Abhimanyu Vishwakarma";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) metaDescription.setAttribute("content", "Backend engineer with a passion for building scalable systems and clean APIs.");
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", "Abhimanyu Vishwakarma | Backend Engineer");
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) ogDescription.setAttribute("content", "Backend engineer with a passion for building scalable systems and clean APIs.");

    // Code Protection Deterrents
    const disableContextMenu = (e) => e.preventDefault();
    const disableDevTools = (e) => {
      if (
        e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) || 
        (e.ctrlKey && e.key === 'U') 
      ) {
        e.preventDefault();
      }
    };
    document.addEventListener('contextmenu', disableContextMenu);
    document.addEventListener('keydown', disableDevTools);

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

    // Scroll to Top & Autohide Navbar Logic using Lenis hook (Highly Optimized)
    let lastScrollY = 0;
    const handleLenisScroll = (e) => {
      const currentScrollY = e.scroll;
      setShowScrollTop(currentScrollY > 400);

      const nav = document.querySelector('nav');
      if (nav) {
        if (currentScrollY > lastScrollY && currentScrollY > nav.offsetHeight) {
          nav.classList.add('nav--hidden');
        } else {
          nav.classList.remove('nav--hidden');
        }
      }
      lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY;
    };
    lenisInstance.on('scroll', handleLenisScroll);

    // Anchor Link Interceptor for Smooth Scroll to prevent sticky header cutoffs
    const handleAnchorClick = (e) => {
      const targetLink = e.target.closest('a');
      if (!targetLink) return;
      
      const href = targetLink.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const targetId = href.substring(1);
        
        if (targetId === '' || targetId === '#') {
          lenisInstance.scrollTo(0, { duration: 1.2 });
        } else {
          const targetElement = document.getElementById(targetId);
          if (targetElement) {
            const navbarHeight = document.querySelector('nav')?.offsetHeight || 62;
            lenisInstance.scrollTo(targetElement, { 
              offset: -navbarHeight, 
              duration: 1.2 
            });
          }
        }
      }
    };
    document.addEventListener('click', handleAnchorClick);

    // Device Capability Checks (Disables hover interactive computations on Mobile/Touch screens)
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    
    // Cached Bounding Rects to avoid layout thrashing inside mousemove loops
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

    const magneticElements = document.querySelectorAll('.btn-primary, .btn-ghost, .nav-logo');
    const projectCards = document.querySelectorAll('.project-card');
    const certCards = document.querySelectorAll('.cert-card');
    const contactItems = document.querySelectorAll('.contact-item');

    if (!isTouchDevice) {
      magneticElements.forEach(el => {
        el.addEventListener('mouseenter', handleHoverEnter);
        el.addEventListener('mousemove', handleMagneticMove);
        el.addEventListener('mouseleave', handleHoverLeave);
      });

      projectCards.forEach(card => {
        card.addEventListener('mouseenter', handleHoverEnter);
        card.addEventListener('mousemove', (e) => handleTiltMove(e, -10, 10));
        card.addEventListener('mouseleave', handleTiltLeave);
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
      document.removeEventListener('contextmenu', disableContextMenu);
      document.removeEventListener('keydown', disableDevTools);
      document.removeEventListener('click', handleAnchorClick);
      sections.forEach(section => observer.unobserve(section));
      sections.forEach(section => revealObserver.unobserve(section));

      if (!isTouchDevice) {
        magneticElements.forEach(el => {
          el.removeEventListener('mouseenter', handleHoverEnter);
          el.removeEventListener('mousemove', handleMagneticMove);
          el.removeEventListener('mouseleave', handleHoverLeave);
        });

        projectCards.forEach(card => {
          card.removeEventListener('mouseenter', handleHoverEnter);
          card.removeEventListener('mouseleave', handleTiltLeave);
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
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <video className="video-bg" autoPlay loop muted playsInline poster="./2026-Racing-Bulls-VCARB-03-003-2160.webp">
        <source src="./f1-wallpaper.webm" type="video/webm" />
        <source src="./f1-wallpaper.mp4" type="video/mp4" />
      </video>

      <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <MobileMenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      
      <SocialSidebar />

      <Hero />
      
      <div className="divider"><hr /></div>
      <Experience />
      
      <div className="divider"><hr /></div>
      <Skills />
      
      <div className="divider"><hr /></div>
      <Projects />
      
      <div className="divider"><hr /></div>
      <Certificates />
      
      <div className="divider"><hr /></div>
      <Education />
      
      <div className="divider"><hr /></div>
      <Contact />
      
      <Footer />

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

      <Football />
    </>
  );
}

export default App;
