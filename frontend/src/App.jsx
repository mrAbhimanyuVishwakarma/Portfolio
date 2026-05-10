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

    // Scroll to Top Logic
    let isScrolling = false;
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      if (!isScrolling) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          setShowScrollTop(currentScrollY > 400);

          lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY;
          isScrolling = false;
        });
        isScrolling = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Magnetic Button Effect
    const handleMagneticMove = (e) => {
      const el = e.currentTarget;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * 0.25;
      const y = (e.clientY - rect.top - rect.height / 2) * 0.25;
      el.style.transform = `translate(${x}px, ${y}px)`;
    };
    const handleMagneticLeave = (e) => {
      e.currentTarget.style.transform = `translate(0px, 0px)`;
    };

    const magneticElements = document.querySelectorAll('.btn-primary, .btn-ghost, .nav-logo');
    magneticElements.forEach(el => {
      el.addEventListener('mousemove', handleMagneticMove);
      el.addEventListener('mouseleave', handleMagneticLeave);
    });

    // 3D Tilt Effect for Project Cards & Contact Items
    const handleTiltMove = (e, factorX, factorY) => {
      const el = e.currentTarget;
      const rect = el.getBoundingClientRect();
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
      e.currentTarget.style.transform = `perspective(1000px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg)`;
    };

    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
      card.addEventListener('mousemove', (e) => handleTiltMove(e, -10, 10));
      card.addEventListener('mouseleave', handleTiltLeave);
    });

    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach(item => {
      item.addEventListener('mousemove', (e) => handleTiltMove(e, -6, 4));
      item.addEventListener('mouseleave', handleTiltLeave);
    });

    // Cleanup
    return () => {
      cancelAnimationFrame(rafId);
      lenisInstance.destroy();
      document.removeEventListener('contextmenu', disableContextMenu);
      document.removeEventListener('keydown', disableDevTools);
      window.removeEventListener('scroll', handleScroll);
      sections.forEach(section => observer.unobserve(section));
      sections.forEach(section => revealObserver.unobserve(section));
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
    </>
  );
}

export default App;
