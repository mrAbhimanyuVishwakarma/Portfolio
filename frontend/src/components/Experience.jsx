import React from 'react';

const Experience = () => {
  return (
    <section className="section" id="experience">
      <p className="section-label">Experience</p>
      <div className="experience-list">
        <div className="exp-card">
          <div className="exp-header">
            <div className="exp-left">
              <p className="exp-role">Software Development Engineer <span className="exp-company">@ Cognizant</span></p>
              <p className="exp-client">Client: Travelers Insurance</p>
            </div>
            <span className="exp-date">Jul 2025 – Present</span>
          </div>
          <ul className="exp-bullets">
            <li>Created a <strong>Spring Boot</strong> project for an application upgrade requirement, containerized the setup using <strong>Docker</strong>, configured <strong>Maven</strong> dependencies, HTTP, and environment profiles to assist testing, deployment, migration <strong>30% faster</strong>.</li>
            <li>Built automation tools for code automation, <strong>PR review</strong>, and TCO production checkout, reducing time by <strong>55%</strong>. Designed a <strong>Python-based AI automation layer</strong> for Jira intake, rule changes, artifact setup, and XML, JSON and <strong>SOAP</strong> testing, reducing manual effort by <strong>40%</strong> with an independent <strong>PowerShell</strong> and <strong>Swagger UI</strong> tool.</li>
            <li>Managed <strong>PR reviews, UAT deployments</strong>, Jira tracking, release monitor, API endpoints integration, <strong>CI/CD</strong>, monitoring and debugging (root cause analysis); troubleshooting <strong>14 major bugs/issues</strong> along with the team infrastructure-as-code.</li>
          </ul>
          <div className="exp-tags">
            <span className="exp-tag">Spring Boot</span>
            <span className="exp-tag">Docker</span>
            <span className="exp-tag">Python</span>
            <span className="exp-tag">REST APIs</span>
            <span className="exp-tag">CI/CD</span>
            <span className="exp-tag">Jira</span>
          </div>
        </div>

        <div className="exp-card">
          <div className="exp-header">
            <div className="exp-left">
              <p className="exp-role">Junior SDE <span className="exp-company">@ Cognizant</span></p>
            </div>
            <span className="exp-date">Jul 2024 – Jun 2025</span>
          </div>
          <ul className="exp-bullets">
            <li>Writing clean <strong>Java</strong> code for business rules, decision tables, validations, and server-side work flow using <strong>IBM ODM Rule Designer</strong> while maintaining post-deployment bug rate under <strong>0.1%</strong> through impact analysis, clean code, routing, testing, code review, and release with continuous improvement solutions.</li>
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
              <p className="exp-role">Software Trainee <span className="exp-company">@ Cognizant</span></p>
            </div>
            <span className="exp-date">Jan 2024 – Jun 2024</span>
          </div>
          <ul className="exp-bullets">
            <li>Worked on <strong>JMS, HTTP, SOAP web services, XML, XSD</strong>, data mapping, <strong>TIBCO EMS</strong>, logging, and exception handling.</li>
            <li>Used <strong>MySQL</strong> and <strong>JDBC</strong> for data validation and integration flows, parsing up to <strong>100,000 records</strong> per week.</li>
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
