import React from 'react';

const Experience = () => {
  return (
    <section className="section" id="experience">
      <p className="section-label">Experience</p>
      <div className="experience-list">
        <div className="exp-card">
          <div className="exp-header">
            <div className="exp-left">
              <p className="exp-role">Junior Software Engineer <span className="exp-company">@ Cognizant</span></p>
              <p className="exp-client">Client: Travelers Insurance (Enterprise Insurance Platform)</p>
            </div>
            <span className="exp-date">Jan 2024 – Present</span>
          </div>
          <ul className="exp-bullets">
            <li>Developed and maintained business logic and automation rules using <strong>Java</strong> and <strong>IBM ODM Rule Designer</strong>, directly impacting insurance decision workflows at enterprise scale.</li>
            <li>Owned PR reviews and production deployments each sprint, managing an 8–10 point Jira board per iteration while maintaining live application stability.</li>
            <li>Built AI-driven automation tooling with <strong>Python and prompt engineering</strong> to accelerate rule development and testing cycles, reducing manual effort across the team.</li>
            <li>Collaborated with QA teams across unit, integration, and UAT phases to ensure high-quality, on-time feature delivery.</li>
            <li>Applied <strong>REST API integration</strong> and <strong>CI/CD pipeline</strong> practices for deployment and monitoring of backend services.</li>
          </ul>
          <div className="exp-tags">
            <span className="exp-tag">Java</span>
            <span className="exp-tag">IBM ODM</span>
            <span className="exp-tag">Python</span>
            <span className="exp-tag">REST APIs</span>
            <span className="exp-tag">CI/CD</span>
            <span className="exp-tag">Agile / Jira</span>
          </div>
        </div>

        <div className="exp-card">
          <div className="exp-header">
            <div className="exp-left">
              <p className="exp-role">GenC Intern <span className="exp-company">@ Cognizant</span></p>
              <p className="exp-client">TIBCO BusinessWorks 6 Training Program</p>
            </div>
            <span className="exp-date">2023</span>
          </div>
          <ul className="exp-bullets">
            <li>Completed enterprise integration training with <strong>TIBCO BW6</strong>, working with JMS, HTTP, SOAP/REST web services, XML/XSD, and data mapping.</li>
            <li>Implemented process orchestration, logging, and exception handling; gained exposure to TIBCO EMS, JMS, and JDBC.</li>
          </ul>
          <div className="exp-tags">
            <span className="exp-tag">Java</span>
            <span className="exp-tag">TIBCO BW6</span>
            <span className="exp-tag">JMS</span>
            <span className="exp-tag">MySQL</span>
            <span className="exp-tag">Web Services</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
