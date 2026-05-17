import React from 'react';

const Experience = () => {
  return (
    <section className="section" id="experience">
      <p className="section-label">Experience</p>
      <div className="experience-list">
        <div className="exp-card">
          <div className="exp-header">
            <div className="exp-left">
              <p className="exp-role">Software Engineer <span className="exp-company">@ Cognizant</span></p>
              <p className="exp-client">Client: Travelers Insurance (Enterprise Insurance Platform)</p>
            </div>
            <span className="exp-date">July 2024 – Present</span>
          </div>
          <ul className="exp-bullets">
            <li>Developing, designing, and maintaining business logic and automation rules using <strong>Java</strong> and <strong>IBM ODM</strong> rule designer (<strong>Eclipse</strong>), directly impacting insurance decision workflows for client.</li>
            <li>Integrated a <strong>AI-driven automation tooling using Python</strong> and <strong>prompt engineering</strong> to accelerate rule development and testing cycles, significantly reducing manual effort across the team. This reduces 40%of code duplicacy and manual efforts.(VS Code)</li>
            <li>Owning team <strong>PR reviews</strong> and <strong>UAT deployments</strong> each sprint, managing <strong>Jira</strong> board per iteration while maintaining application health and stability.</li>
            <li>Collaborated with QA teams to support unit testing, integration testing, and user acceptance testing(UAT), ensuring high-quality feature delivery faster and more realible using <strong>python script automation</strong> in SOAP for SOAP UI and Postman </li>
            <li>Applied <strong>REST API integration</strong> and <strong>CI/CD pipeline</strong> practices for deployment and monitoring of backend services.</li>
          </ul>
          <div className="exp-tags">
            <span className="exp-tag">Java</span>
            <span className="exp-tag">Python using AI</span>
            <span className="exp-tag">IBM ODM</span>
            <span className="exp-tag">REST APIs</span>
            <span className="exp-tag">CI/CD</span>
            <span className="exp-tag">Agile / Jira</span>
            <span className="exp-tag">VS Code | Eclipse</span>
            <span className="exp-tag">SOAP</span>
          </div>
        </div>

        <div className="exp-card">
          <div className="exp-header">
            <div className="exp-left">
              <p className="exp-role">GenC Intern <span className="exp-company">@ Cognizant</span></p>
              <p className="exp-client">TIBCO BusinessWorks 6 Training Program</p>
            </div>
            <span className="exp-date">Jan 2024 – June 2024</span>
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
            <span className="exp-tag">SOAP UI | Postman</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
