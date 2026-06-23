import React from 'react';

const Experience = () => {
  return (
    <section className="section" id="experience">
      <p className="section-label">Experience</p>
      <div className="experience-list">
        <div className="exp-card">
          <div className="exp-header">
            <div className="exp-left">
              <p className="exp-role">Software Development Engineer (Hybrid) <span className="exp-company">@ Cognizant</span></p>
              <p className="exp-client">Client: Travelers Insurance</p>
            </div>
            <span className="exp-date">Jul 2025 – Present</span>
          </div>
          <ul className="exp-bullets">
            <li>Owning team <strong>GitHub PR Reviews</strong> and <strong>UAT deployments</strong>, managing <strong>Jira board</strong> while maintaining application health and stability.</li>
            <li>Designed and integrated an <strong>AI-driven Python automation layer</strong> to handle Jira intake, rule changes, and XML testing; manual efforts and code duplication by 40% reduction. Collaborated with other teams to implement <strong>Python automation</strong> support for unit testing, integration testing, and user acceptance testing (UAT), ensuring high-quality and faster delivery in <strong>SOAP</strong>.</li>
            <li>Applied <strong>REST API integration</strong> and <strong>CI/CD practices</strong> for monitoring and deployment of backend services.</li>
          </ul>
          <div className="exp-tags">
            <span className="exp-tag">Python (scripting)</span>
            <span className="exp-tag">REST APIs</span>
            <span className="exp-tag">CI/CD</span>
            <span className="exp-tag">Jira</span>
            <span className="exp-tag">SOAP</span>
          </div>
        </div>

        <div className="exp-card">
          <div className="exp-header">
            <div className="exp-left">
              <p className="exp-role">Junior Software Developer <span className="exp-company">@ Cognizant</span></p>
            </div>
            <span className="exp-date">Jul 2024 – Jun 2025</span>
          </div>
          <ul className="exp-bullets">
            <li>Developing design and maintaining business logic and automation rules using <strong>Java</strong> and <strong>IBM ODM</strong> rule designer (<strong>Eclipse</strong>), directly impacting insurance decision workflows for clients.</li>
            <li>Kept post-deployment bug rate under <strong>0.1%</strong> by writing clean, well-tested rule logic before every release.</li>
            <li>Adapted to the full sprint workflow from day one, encompassing code development, peer review, testing, and production deployment.</li>
          </ul>
          <div className="exp-tags">
            <span className="exp-tag">Java</span>
            <span className="exp-tag">IBM ODM</span>
            <span className="exp-tag">Eclipse</span>
          </div>
        </div>

        <div className="exp-card">
          <div className="exp-header">
            <div className="exp-left">
              <p className="exp-role">Data Analyst Intern <span className="exp-company">@ Cognizant</span></p>
              <p className="exp-client">GenC Intern</p>
            </div>
            <span className="exp-date">Jan 2024 – Jun 2024</span>
          </div>
          <ul className="exp-bullets">
            <li>Worked with tools and protocols such as <strong>TIBCO EMS, JMS, HTTP, SOAP/REST API, XML/XSD</strong>, and data mapping. Implemented process orchestration, logging, and exception handling.</li>
            <li>Used <strong>MySQL</strong> alongside <strong>JDBC</strong> to handle real data during integration flows and understood backend.</li>
          </ul>
          <div className="exp-tags">
            <span className="exp-tag">TIBCO EMS</span>
            <span className="exp-tag">JMS</span>
            <span className="exp-tag">MySQL</span>
            <span className="exp-tag">JDBC</span>
            <span className="exp-tag">XML/XSD</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
