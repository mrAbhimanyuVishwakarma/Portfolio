import React from 'react';

const Certificates = () => {
  const certs = [
    {
      id: "01",
      title: "Java, Spring Boot, Microservices Assessment",
      issuer: "HackerRank",
      date: "May 2026",
      cid: "", // Verification details pending
      url: ""  // Verification details pending
    },
    {
      id: "02",
      title: "Software Engineer Certificate",
      issuer: "HackerRank",
      date: "May 2026",
      cid: "bb1aa9e2f0d4",
      url: "https://www.hackerrank.com/certificates/bb1aa9e2f0d4"
    },
    {
      id: "03",
      title: "Java Programming Mastery",
      issuer: "Udemy",
      date: "Apr 2024",
      cid: "UC-fbc84728-8b1a-4985-b107-8fee8233f883",
      url: "https://ude.my/UC-fbc84728-8b1a-4985-b107-8fee8233f883"
    },
    {
      id: "04",
      title: "SQL for beginners: Learn SQL using MySQL and Database Design",
      issuer: "Udemy",
      date: "Feb 2024",
      cid: "UC-aa5f29da-5168-4547-be5e-7e7bf018bc84",
      url: "https://ude.my/UC-aa5f29da-5168-4547-be5e-7e7bf018bc84"
    }
  ];

  return (
    <section className="section" id="certifications">
      <p className="section-label">Certifications</p>
      <div className="certs-grid">
        {certs.map((cert, idx) => (
          <div key={idx} className="cert-card">
            <div className="cert-header">
              <span className="cert-number">{cert.id}</span>
              <span className="cert-date">{cert.date}</span>
            </div>
            <div className="cert-body">
              <p className="cert-title">{cert.title}</p>
              <p className="cert-issuer">Issued by <strong>{cert.issuer}</strong></p>
              {cert.cid && (
                <p className="cert-cid">ID: <code>{cert.cid}</code></p>
              )}
            </div>
            {cert.url && (
              <div className="cert-footer">
                <a href={cert.url} target="_blank" rel="noopener noreferrer" className="cert-action">
                  Verify Credential →
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Certificates;
