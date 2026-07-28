import React from 'react';

const Footer = () => {
  return (
    <footer style={{ flexDirection: 'column', alignItems: 'stretch' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
        <p>© 2026 Abhimanyu Vishwakarma</p>
        <p>Built with care <span className="heart-beat">❤️</span></p>
      </div>
      <div id="privacy-policy" style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '11px', color: 'var(--muted)', lineHeight: '1.6', textAlign: 'center' }}>
        <p style={{ marginBottom: '6px', color: 'var(--text)', fontWeight: '600', fontSize: '12px' }}>Privacy Policy</p>
        <div style={{ textAlign: 'left', width: '100%', margin: '0 auto' }}>
          <p style={{ marginBottom: '10px' }}>
            <strong>Data Collection:</strong> This website is a personal portfolio and does not actively collect, store, or process any personal data from its visitors. It operates entirely without the use of tracking cookies, analytics tools, or third-party advertising scripts. Your browsing experience here is completely private.
          </p>
          <p style={{ marginBottom: '10px' }}>
            <strong>Communication & Privacy:</strong> If you choose to contact me via email or through any linked professional platforms (such as LinkedIn or GitHub), any personal information you provide will be kept strictly confidential. Your details will only be used for the direct purpose of responding to your inquiry and will never be shared, sold, or distributed.
          </p>
          <p>
            <strong>External Links:</strong> This site contains outbound links to external websites and platforms. Please be aware that I am not responsible for the privacy practices, data collection, or content of these external sites. Once you leave this portfolio, their respective privacy policies and terms of service will apply.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
