import { useEffect } from 'react';
import { LuX, LuShieldCheck, LuScale } from 'react-icons/lu';
import './LegalModal.css';

const LegalModal = ({ isOpen, onClose }) => {
  // Close modal on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className={`legal-modal-backdrop ${isOpen ? 'open' : ''}`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
    >
      <div className="legal-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="legal-modal-header">
          <h2 id="legal-modal-title" className="legal-modal-title">
            <LuShieldCheck size={22} />
            Privacy & Legal Notice
          </h2>
          <button
            type="button"
            className="legal-modal-close"
            onClick={onClose}
            aria-label="Close legal modal"
          >
            <LuX size={18} />
          </button>
        </div>

        <div className="legal-modal-body">
          {/* Section 1: Legal Notice & Terms */}
          <div className="legal-section">
            <div className="legal-section-header">
              <LuScale size={18} />
              <span>Legal Notice & Terms</span>
            </div>
            <p>
              <strong>Copyright © 2026 Abhimanyu Vishwakarma.</strong> All rights reserved.
            </p>
            <p>
              <strong>Portfolio Intellectual Property:</strong> All original engineering code, interface designs, interactive prototypes, and architectural concepts authored on this portfolio are the proprietary intellectual property of Abhimanyu Vishwakarma unless otherwise explicitly credited.
            </p>
            <p>
              <strong>External Project Demo Usage:</strong> Third-party company names, technology trademarks, and platform logos (such as Java, Spring Boot, Apache Kafka, React, Docker, and AWS) are property of their respective owners. Their mention signifies technical experience and demonstrative capability, not direct endorsement.
            </p>
          </div>

          {/* Section 2: Privacy Policy */}
          <div className="legal-section">
            <div className="legal-section-header">
              <LuShieldCheck size={18} />
              <span>Privacy Policy</span>
            </div>
            <p>
              <strong>Zero Tracking Cookies:</strong> This website operates with a strict privacy-first posture. No third-party tracking cookies, fingerprinting mechanisms, or advertising analytics scripts are loaded or executed.
            </p>
            <p>
              <strong>Local-Only Theme Storage:</strong> Your visual preference (monochrome dark or light theme) is persisted exclusively on your local device via standard browser <code>localStorage</code>. No preference data or analytics ever leave your browser.
            </p>
            <p>
              <strong>Voluntary Direct Communication:</strong> If you contact me directly via email or professional profiles, your email address and message contents are kept strictly confidential. They are utilized solely to respond to your inquiry and are never sold, rented, or distributed.
            </p>
            <p>
              <strong>External Links Disclaimer:</strong> Outbound links connect to external platforms (including GitHub, LinkedIn, and live project deployments). Once you navigate beyond this domain, their respective terms of service and privacy practices apply.
            </p>
          </div>
        </div>

        <div className="legal-modal-footer">
          <button type="button" className="legal-modal-btn" onClick={onClose}>
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};

export default LegalModal;
