import React from 'react';

const Hero = () => {
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
        <h1>Abhimanyu<br /><em>Vishwakarma</em></h1>
        <div className="hero-actions">
          <a href="#" className="btn-primary copy-email" onClick={copyEmail}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="4" width="20" height="16" rx="2"></rect>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
            </svg>
            Get in touch
          </a>
          <a href="./Abhimanyu_Vishwakarma_Resume.pdf" download className="btn-ghost">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
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
