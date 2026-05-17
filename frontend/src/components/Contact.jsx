import React, { useEffect } from 'react';

const Contact = () => {
  const copyEmail = (e) => {
    e.preventDefault();
    const email = 'abhimanyuvishwakarma9228@gmail.com';
    navigator.clipboard.writeText(email).then(() => {
      // Very simple toast implementation
      const existingToast = document.querySelector('.toast-notification');
      if (existingToast) existingToast.remove();
  
      const toast = document.createElement('div');
      toast.className = 'toast-notification';
      toast.textContent = 'Email copied to clipboard!';
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
    });
  };

  useEffect(() => {
    // Append the LinkedIn badge script dynamically
    const script = document.createElement('script');
    script.src = "https://platform.linkedin.com/badges/js/profile.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <section className="section" id="contact">
      <p className="section-label">Find Me On</p>
      <div className="contact-row">
        <a href="https://www.linkedin.com/in/abhimanyu-vishwakarma-680a88227" target="_blank" rel="noopener noreferrer" className="contact-item">
          <div className="contact-left">
            <div className="contact-icon">
              <svg viewBox="0 0 24 24" fill="currentColor" style={{ color: '#7cc2ff' }}>
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path>
              </svg>
            </div>
            <div>
              <p className="contact-name">LinkedIn</p>
              <p className="contact-handle">abhimanyu-vishwakarma</p>
            </div>
          </div>
          <span className="contact-arrow">↗</span>
        </a>

        <a href="https://www.hackerrank.com/profile/abhimanyuvishwa1" target="_blank" rel="noopener noreferrer" className="contact-item">
          <div className="contact-left">
            <div className="contact-icon">
              <svg viewBox="0 0 24 24" fill="currentColor" style={{ color: '#2ec866' }}>
                <path d="M7.054 6.966h3.407v3.315H7.054V6.966zm6.485 0h3.407v10.068h-3.407V6.966zm-6.485 6.753h3.407v3.315H7.054v-3.315z"></path>
              </svg>
            </div>
            <div>
              <p className="contact-name">HackerRank</p>
              <p className="contact-handle">abhimanyuvishwa1</p>
            </div>
          </div>
          <span className="contact-arrow">↗</span>
        </a>

        <a href="https://github.com/mrAbhimanyuVishwakarma" target="_blank" rel="noopener noreferrer" className="contact-item">
          <div className="contact-left">
            <div className="contact-icon">
              <svg viewBox="0 0 24 24" fill="currentColor" style={{ color: '#f7f3ef' }}>
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"></path>
              </svg>
            </div>
            <div>
              <p className="contact-name">GitHub</p>
              <p className="contact-handle">mrAbhimanyuVishwakarma</p>
            </div>
          </div>
          <span className="contact-arrow">↗</span>
        </a>

        <a href="#" className="contact-item copy-email" onClick={copyEmail}>
          <div className="contact-left">
            <div className="contact-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="#f7f3ef" strokeWidth="1.8" style={{ width: '16px', height: '16px' }}>
                <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
              </svg>
            </div>
            <div>
              <p className="contact-name">Email</p>
              <p className="contact-handle">abhimanyuvishwakarma9228@gmail.com</p>
            </div>
          </div>
          <span className="contact-arrow">↗</span>
        </a>
      </div>
      <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="badge-base LI-profile-badge" data-locale="en_US" data-size="medium" data-theme="dark" data-type="VERTICAL" data-vanity="abhimanyu-vishwakarma-680a88227" data-version="v1"></div>
      </div>
    </section>
  );
};

export default Contact;
