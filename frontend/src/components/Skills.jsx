import React from 'react';

const Skills = () => {
  return (
    <section className="section" id="skills">
      <p className="section-label">Tech Stack</p>
      <div className="skills-grid">
        <span className="skill-tag">Java</span>
        <span className="skill-tag">Spring Boot</span>
        <span className="skill-tag">MySQL</span>
        <span className="skill-tag">Kafka</span>
        <span className="skill-tag">AWS | GCP</span>
        <span className="skill-tag">Microservices</span>
        <span className="skill-tag">REST APIs</span>
        <span className="skill-tag">Git | GitHub</span>
        <span className="skill-tag">CI | CD</span>
        <span className="skill-tag">Jira</span>
        <span className="skill-tag">IBM ODM</span>
      </div>

      <div className="learning-block">
        <p className="learning-label">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: '-1px', marginRight: '6px' }}><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>
          Currently levelling up
        </p>
        <div className="skills-grid" style={{ marginTop: '0.75rem' }}>
          <span className="skill-tag skill-learning">Spring Boot</span>
          <span className="skill-tag skill-learning">Low-Level Design</span>
        </div>
      </div>
    </section>
  );
};

export default Skills;
