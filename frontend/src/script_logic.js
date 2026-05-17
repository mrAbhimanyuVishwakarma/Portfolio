const navToggle = document.querySelector('.nav-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileLinks = mobileMenu.querySelectorAll('a');

  const setMenuState = (isOpen) => {
    mobileMenu.classList.toggle('is-open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    mobileMenu.setAttribute('aria-hidden', String(!isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  navToggle.addEventListener('click', () => {
    const nextState = navToggle.getAttribute('aria-expanded') !== 'true';
    setMenuState(nextState);
  });

  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => setMenuState(false));
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      setMenuState(false);
    }
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      setMenuState(false);
    }
  });

  // Active Navigation Highlighting (Scroll Spy)
  const sections = document.querySelectorAll('.section');
  const navItems = document.querySelectorAll('.nav-links a');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navItems.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href').substring(1) === entry.target.id) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { threshold: 0.5 }); // Triggers when 50% of the section is visible

  sections.forEach(section => observer.observe(section));

  // Scroll Reveal Animations
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target); // Stops observing once revealed
      }
    });
  }, { threshold: 0.15 }); // Triggers when 15% of section is visible

  sections.forEach(section => revealObserver.observe(section));

  // Scroll to Top & Hiding Nav Logic
  const scrollTopBtn = document.getElementById('scroll-to-top');
  const nav = document.querySelector('nav');
  let lastScrollY = window.scrollY;

  let isScrolling = false;
  window.addEventListener('scroll', () => {
    if (!isScrolling) {
      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;

        // Scroll to top button
        if (currentScrollY > 400) {
          scrollTopBtn.classList.add('show');
        } else {
          scrollTopBtn.classList.remove('show');
        }

        // Hiding nav
        if (currentScrollY > lastScrollY && currentScrollY > nav.offsetHeight) {
          nav.classList.add('nav--hidden');
        } else {
          nav.classList.remove('nav--hidden');
        }
        
        lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY;
        isScrolling = false;
      });
      isScrolling = true;
    }
  }, { passive: true });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // 3D Tilt Effect for Project Cards
  const projectCards = document.querySelectorAll('.project-card');
  
  projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -10; // Increased max rotation
      const rotateY = ((x - centerX) / centerX) * 10;
      
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      card.style.transform = `perspective(1000px) scale3d(1.04, 1.04, 1.04) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg)`;
    });
  });

  // 3D Tilt Effect for Contact Items
  const contactItems = document.querySelectorAll('.contact-item');
  
  contactItems.forEach(item => {
    item.addEventListener('mousemove', (e) => {
      const rect = item.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -6; // Subtle X rotation
      const rotateY = ((x - centerX) / centerX) * 4;  // Subtler Y rotation for wide cards
      
      item.style.setProperty('--mouse-x', `${x}px`);
      item.style.setProperty('--mouse-y', `${y}px`);

      item.style.transform = `perspective(1000px) scale3d(1.02, 1.02, 1.02) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    item.addEventListener('mouseleave', () => {
      item.style.transform = `perspective(1000px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg)`;
    });
  });

  // Magnetic Button Effect
  const magneticElements = document.querySelectorAll('.btn-primary, .btn-ghost, .nav-logo');
  
  magneticElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * 0.25;
      const y = (e.clientY - rect.top - rect.height / 2) * 0.25;
      el.style.transform = `translate(${x}px, ${y}px)`;
    });
    
    el.addEventListener('mouseleave', () => {
      el.style.transform = `translate(0px, 0px)`;
    });
  });

  // Typewriter Effect on Scroll
  const setupTypewriter = (element, delay = 0) => {
    const originalText = element.innerText.trim();
    if (!originalText) return;

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

  const typewriterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.project-desc, .contact-handle').forEach(el => {
          setupTypewriter(el, 0);
        });
        typewriterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('#projects, #contact').forEach(section => typewriterObserver.observe(section));

  // Copy Email to Clipboard Logic
  const copyEmailBtns = document.querySelectorAll('.copy-email');
  copyEmailBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = 'abhimanyuvishwakarma9228@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast('Email copied to clipboard!');
      });
    });
  });

  function showToast(message) {
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
  }

  // Dynamic GitHub Repository Visibility Check
  const checkRepoVisibility = async () => {
    const projectCards = document.querySelectorAll('.project-card');
    
    for (const card of projectCards) {
      const url = card.getAttribute('href');
      const badge = card.querySelector('.repo-visibility-badge');
      
      // Only check if it's a GitHub link and has the visibility badge
      if (url && url.includes('github.com') && badge) {
        try {
          const urlPath = new URL(url).pathname.split('/').filter(Boolean);
          if (urlPath.length >= 2) {
            const owner = urlPath[0];
            const repo = urlPath[1];
            
            // Call the GitHub API
            const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
            
            if (response.status === 404) {
              // If 404, the repo is private (or deleted)
              badge.textContent = 'Private';
              badge.className = 'project-badge private repo-visibility-badge';
              
              // Disable the link so users don't hit a 404 page
              card.removeAttribute('href');
              const actionText = card.querySelector('.project-action');
              if (actionText) actionText.textContent = 'Private Repository';
            }
          }
        } catch (error) {
          console.error('Failed to check repo visibility:', error);
        }
      }
    }
  };
  
  checkRepoVisibility();

  // --- Code Protection Deterrents ---
  // Disable right-click context menu
  document.addEventListener('contextmenu', (e) => e.preventDefault());

  // Disable common developer tools keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (
      e.key === 'F12' || // F12
      (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) || // Ctrl+Shift+I/J/C
      (e.ctrlKey && e.key === 'U') // Ctrl+U (View Source)
    ) {
      e.preventDefault();
    }
  });
