import React from 'react';

const Education = () => {
  return (
    <section className="section" id="education">
      <p className="section-label">Education</p>
      <div className="exp-card">
        <div className="exp-header">
          <div className="exp-left">
            <p className="exp-role">B.Tech, Mechanical Engineering</p>
            <p className="exp-client">Dr. B.C. Roy Engineering College, Durgapur, WB</p>
          </div>
          <span className="exp-date">2019 – 2023</span>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '0.2rem' }}>
          CGPA: <strong style={{ color: 'var(--text)' }}>8.83 / 10</strong>
        </p>
      </div>
    </section>
  );
};

export default Education;
