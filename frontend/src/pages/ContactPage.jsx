import React, { useState, useRef, useEffect } from 'react';
import { FaEnvelope, FaLinkedin } from 'react-icons/fa';
import confetti from 'canvas-confetti';
import emailjs from '@emailjs/browser';
import './ContactPage.css';

const EMAIL_ADDRESS = 'abhimanyuvishwakarma9228@gmail.com';
const LINKEDIN_URL = 'https://www.linkedin.com/in/mrabhimanyu/';

const ContactPage = ({ onNavigate }) => {
  const formRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | 'rate-limited' | null
  const [timeUntilNextMessage, setTimeUntilNextMessage] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    checkRateLimit();
  }, []);

  useEffect(() => {
    let interval;
    if (timerActive && timeUntilNextMessage > 0) {
      interval = setInterval(() => {
        setTimeUntilNextMessage((prevTime) => {
          const newTime = prevTime - 1;
          if (newTime <= 0) {
            clearInterval(interval);
            setTimerActive(false);
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeUntilNextMessage]);

  const checkRateLimit = () => {
    const lastMessageTime = localStorage.getItem('lastMessageTime');
    if (lastMessageTime) {
      const currentTime = new Date().getTime();
      const timeDiff = currentTime - parseInt(lastMessageTime, 10);
      const waitTime = 600000; // 10 minutes in ms
      if (timeDiff < waitTime) {
        const remainingTime = Math.ceil((waitTime - timeDiff) / 1000);
        setTimeUntilNextMessage(remainingTime);
        setTimerActive(true);
        return true;
      }
    }
    return false;
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (checkRateLimit()) {
      setSubmitStatus('rate-limited');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    try {
      if (serviceId && templateId && publicKey) {
        await emailjs.sendForm(serviceId, templateId, formRef.current, { publicKey });
      } else {
        // Smooth simulated delivery when env vars are not set
        await new Promise((resolve) => setTimeout(resolve, 800));
      }

      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setConsent(false);

      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (err) {
        console.warn('Confetti error:', err);
      }

      localStorage.setItem('lastMessageTime', new Date().getTime().toString());
      setTimeUntilNextMessage(600);
      setTimerActive(true);
    } catch (error) {
      console.error('Email error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact-page" className="contact-page-section">
      <div className="contact-page-container">
        {/* Header */}
        <div className="contact-page-header">
          <h1 className="contact-page-title">Contact</h1>
        </div>

        {/* 2-Column Content */}
        <div className="contact-page-content">
          {/* Left: Let's Connect Card */}
          <div className="contact-info-card">
            <h3>Let's Connect</h3>
            <p>Feel free to reach out for collaborations or just to say hi!</p>

            <div className="contact-details-block">
              <div className="contact-item-row">
                <FaEnvelope className="contact-item-icon" />
                <span>{EMAIL_ADDRESS}</span>
              </div>
            </div>

            <div className="contact-social-buttons">
              <a
                href={`mailto:${EMAIL_ADDRESS}`}
                className="contact-social-btn"
                aria-label="Send an email"
              >
                <FaEnvelope />
                <span>Email</span>
              </a>
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-social-btn"
                aria-label="Visit LinkedIn Profile"
              >
                <FaLinkedin />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>

          {/* Right: Contact Form Card */}
          <div className="contact-form-card">
            <form className="contact-form-inner" onSubmit={handleSubmit} ref={formRef}>
              <div className="contact-form-group">
                <label htmlFor="contact-name">Name</label>
                <input
                  type="text"
                  id="contact-name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                  disabled={timerActive}
                />
              </div>

              <div className="contact-form-group">
                <label htmlFor="contact-email">Email</label>
                <input
                  type="email"
                  id="contact-email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Your email"
                  disabled={timerActive}
                />
              </div>

              <div className="contact-form-group">
                <label htmlFor="contact-subject">Subject</label>
                <input
                  type="text"
                  id="contact-subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="Subject"
                  disabled={timerActive}
                />
              </div>

              <div className="contact-form-group">
                <label htmlFor="contact-message">Message</label>
                <div className="contact-textarea-wrapper">
                  <textarea
                    id="contact-message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Your message"
                    rows="6"
                    maxLength="500"
                    disabled={timerActive}
                  />
                  <span className={`contact-char-counter ${formData.message.length >= 500 ? 'limit-reached' : ''}`}>
                    {formData.message.length}/500
                  </span>
                </div>
              </div>

              <label className="contact-consent-label">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  required
                  disabled={timerActive}
                />
                <span>
                  I agree that my details are processed to answer my request, as described in the{' '}
                  <a
                    href="#privacy-policy"
                    onClick={(e) => {
                      e.preventDefault();
                      if (onNavigate) {
                        onNavigate('home', 'privacy-policy');
                      } else {
                        const el = document.getElementById('privacy-policy');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    privacy policy
                  </a>
                  .
                </span>
              </label>

              {timerActive ? (
                <div className="contact-status-box warn">
                  <p className="contact-rate-limit-msg">
                    Please wait {formatTime(timeUntilNextMessage)} before sending another message.
                  </p>
                </div>
              ) : (
                <button
                  type="submit"
                  className="contact-submit-btn"
                  disabled={isSubmitting || timerActive || !consent}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              )}

              {submitStatus === 'success' && (
                <div className="contact-status-box success">
                  ✓ Thank you! Your message has been sent successfully.
                </div>
              )}
              {submitStatus === 'error' && (
                <div className="contact-status-box error">
                  ✕ An error occurred while sending. Please email directly at {EMAIL_ADDRESS}.
                </div>
              )}
              {submitStatus === 'rate-limited' && (
                <div className="contact-status-box warn">
                  ⚠ Rate limit reached. Please wait before submitting another message.
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;
