import React, { useEffect, useRef } from 'react';

const Hero = () => {
  const bioRef = useRef(null);

  useEffect(() => {
    // Typewriter effect setup
    const setupTypewriter = (element, delay = 0) => {
      const originalText = element.getAttribute('data-text') || element.innerText.trim();
      if (!originalText) return;
      if (!element.getAttribute('data-text')) {
          element.setAttribute('data-text', originalText);
      }

      element.innerHTML = '<span class="typewriter-text"></span><span class="typewriter-cursor"></span>';
      const textSpan = element.querySelector('.typewriter-text');
      const cursorSpan = element.querySelector('.typewriter-cursor');
      
      let charIndex = 0;
      
      function type() {
        if (charIndex < originalText.length) {
          textSpan.textContent += originalText.charAt(charIndex);
          charIndex++;
          
          let currentSpeed = Math.random() * 40 + 20;
          
          const lastChar = originalText.charAt(charIndex - 1);
          if (lastChar === '.' || lastChar === ',') {
            currentSpeed += 250;
          }
          
          setTimeout(type, currentSpeed);
        } else {
          if (cursorSpan) cursorSpan.style.display = 'none';
        }
      }
      
      setTimeout(type, delay);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && bioRef.current) {
                setupTypewriter(bioRef.current, 800);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });

    if (bioRef.current) {
        observer.observe(bioRef.current);
    }

    return () => {
        if (bioRef.current) observer.unobserve(bioRef.current);
    }
  }, []);

  const copyEmail = (e) => {
    e.preventDefault();
    const email = 'abhimanyuvishwakarma9228@gmail.com';
    navigator.clipboard.writeText(email).then(() => {
      showToast('Email copied to clipboard!');
    });
  };

  const showToast = (message) => {
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    Object.assign(toast.style, {
      position: 'fixed', bottom: '100px', left: '50%', transform: 'translateX(-50%) translateY(20px)',
      background: 'var(--text)', color: '#090b10', padding: '12px 24px', borderRadius: '999px',
      fontWeight: '700', fontSize: '13px', zIndex: '1000', opacity: '0',
      boxShadow: '0 8px 24px rgba(0,0,0,0.2)', transition: 'all 0.3s ease'
    });
    document.body.appendChild(toast);
    
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(20px)';
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  };

  return (
    <section className="hero">
      <div className="hero-shell">
        <span className="hero-tag">Available for opportunities</span>
        <h1>Abhimanyu<br/><em>Vishwakarma</em></h1>
        <p className="hero-bio" ref={bioRef}>
          I'm a backend engineer from Bengaluru with 2+ years at Cognizant, where I've been working on real enterprise systems for a large insurance client. Java and IBM ODM are my daily tools — and right now I'm deep into learning Spring Boot and system design, because I want to grow into the kind of engineer who builds products people actually use.
        </p>
        <div className="hero-actions">
          <a href="#" className="btn-primary copy-email" onClick={copyEmail}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="4" width="20" height="16" rx="2"></rect>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
            </svg>
            Get in touch
          </a>
          <a href="./Abhimanyu_Vishwakarma_Resume.pdf" download className="btn-ghost">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Resume
          </a>
          <a href="https://github.com/mrAbhimanyuVishwakarma" target="_blank" rel="noopener noreferrer" className="btn-ghost">
            GitHub →
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
