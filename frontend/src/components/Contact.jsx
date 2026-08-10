import React, { useState, useEffect } from 'react';

const Contact = () => {
  const [followers, setFollowers] = useState('4,987+');
  const [connections, setConnections] = useState('500+');

  useEffect(() => {
    // LinkedIn heavily restricts scraping its public profiles (returns HTTP 999 to bots).
    // To fetch this dynamically, you would need a backend serverless function (like Next.js API or AWS Lambda)
    // that connects to a dedicated API like Proxycurl, Nubela, or a headless browser service to bypass LinkedIn's bot detection.
    //
    // Example backend fetch structure:
    // fetch('/api/linkedin-stats')
    //   .then(res => res.json())
    //   .then(data => setFollowers(data.followers))
    //   .catch(err => console.error(err));
  }, []);

  const copyEmail = (e) => {
    const email = 'abhimanyuvishwakarma9228@gmail.com';
    navigator.clipboard.writeText(email).then(() => {
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

  return (
    <section className="section">

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center', justifyContent: 'center', width: '100%', maxWidth: '1150px', margin: '0 auto', marginTop: '2.5rem' }}>
        {/* 👇 TO ADJUST OVERALL WIDTH manually, change maxWidth: '1150px' above */}

        {/* Left Side: Custom LinkedIn Card */}
        <div style={{ flex: '1 1 420px', display: 'flex', justifyContent: 'center' }}>
          <div className="custom-linkedin-card" style={{ margin: '0' }}>
            <div className="card-image-container">
              <img src="/mrAbhimanyu.png" alt="Profile" />
            </div>
            <div className="card-content">
              <div className="card-title-area">
                <h3>Abhimanyu Vishwakarma</h3>
                <div className="badge-wrapper">
                  <svg className="verified-badge" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                  <div className="badge-tooltip">Verified</div>
                </div>
                <div className="badge-wrapper">
                  <svg className="premium-badge" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                  <div className="badge-tooltip">LinkedIn Premium</div>
                </div>
              </div>
              <div className="card-bio">
                <div style={{ color: 'var(--text)', fontSize: '18px', marginBottom: '5px' }}>Software Development Engineer</div>
                <div style={{ color: 'var(--muted)', fontSize: '17px' }}>
                  Bengaluru, Karnataka, India
                  <div style={{ marginTop: '6px' }}>
                    <div className="contact-info-wrapper" style={{ position: 'relative', display: 'inline-block' }}>
                      <a href="#contact" className="contact-info-link" style={{ color: '#70b5f9', textDecoration: 'none', fontWeight: '500', cursor: 'pointer' }}>Contact info</a>
                      <div className="contact-info-popup">
                        <div className="popup-header">Contact info</div>
                        <div className="popup-item"><strong>Email:</strong> abhimanyuvishwakarma9228@gmail.com</div>
                        <div className="popup-item"><strong>GitHub:</strong> mrAbhimanyuVishwakarma</div>
                        <div className="popup-item"><strong>X:</strong> mrAbhimanyu07</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-footer">
                <div className="card-stats">
                  <span className="stat" title="Followers">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    {followers}
                  </span>
                  <span className="stat" title="Connections">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                    </svg>
                    {connections}
                  </span>
                </div>
                <a href="https://www.linkedin.com/in/mrabhimanyuvishwakarma/" target="_blank" rel="noopener noreferrer" className="hire-me-btn">Hire Me +</a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Contact Items & Summary */}
        {/* 👇 TO ADJUST RIGHT-SIDE WIDTH manually, change the 580px value below (e.g. to 600px or 700px) */}
        <div style={{ flex: '1.2 1 630px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          <div className="hero-shell" style={{ maxWidth: '100%', padding: '2rem' }}>
            <h1>Abhimanyu<br /><em>Vishwakarma</em></h1>

            <div className="about-summary" style={{ margin: '1rem 0' }}>
              <p style={{ color: 'var(--muted)', lineHeight: '1.6', fontSize: '0.95rem' }}>
                <span style={{ fontSize: '1.4rem', color: 'var(--text)', lineHeight: 1 }}>S</span>oftware Development Engineer specializing in full stack development, backend development, scalable architectures, and automation workflows. Proven ability to design robust APIs, optimize performance, and solve complex algorithmic challenges. Always eager to explore new technologies and build products that make a real impact.
              </p>
            </div>

            <div className="hero-actions">
              <a href="./Abhimanyu_Vishwakarma_Resume.pdf" download className="hire-me-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                Resume
              </a>
              <a href="#privacy-policy" className="btn-ghost">
                Privacy Policy
              </a>
            </div>
          </div>

          <a href="mailto:abhimanyuvishwakarma9228@gmail.com" className="contact-item copy-email small-bar" onClick={copyEmail}>
            <div className="contact-left">
              <div className="contact-icon" style={{ color: 'var(--text)' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: '16px', height: '16px' }}>
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

          <a href="https://github.com/mrAbhimanyuVishwakarma" target="_blank" rel="noopener noreferrer" className="contact-item small-bar">
            <div className="contact-left">
              <div className="contact-icon" style={{ color: 'var(--text)' }}>
                <svg viewBox="0 0 24 24" fill="currentColor" style={{ color: 'inherit' }}>
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

          <a href="https://x.com/mrAbhimanyu07" target="_blank" rel="noopener noreferrer" className="contact-item small-bar">
            <div className="contact-left">
              <div className="contact-icon" style={{ color: 'var(--text)' }}>
                <svg viewBox="0 0 24 24" fill="currentColor" style={{ color: 'inherit' }}>
                  <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"></path>
                </svg>
              </div>
              <div>
                <p className="contact-name">X (Twitter)</p>
                <p className="contact-handle">mrAbhimanyu07</p>
              </div>
            </div>
            <span className="contact-arrow">↗</span>
          </a>

        </div>
      </div>
    </section>
  );
};

export default Contact;
