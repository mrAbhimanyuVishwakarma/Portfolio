import React, { useEffect, useRef, useState } from 'react';

const Projects = () => {
  const [repos, setRepos] = useState([
    {
      id: "01",
      title: "Student.ai",
      desc: "An AI-powered productivity app for students — covering learning assistance, task scheduling, and progress tracking. Designed as a solo-built full-stack product exploring AI integration in real-world apps.",
      url: "https://github.com/mrAbhimanyuVishwakarma/Student.ai",
      tech: ["Python", "AI APIs", "Backend", "Full-stack"],
      visibility: "Public"
    },
    {
      id: "02",
      title: "APEX — Algorithmic Trading Bot",
      desc: "An AI-powered trading bot with a clear separation between backtesting and live trading environments. Uses a central feature store to ensure data parity across modes, with TradingView for signal analysis and Alpaca as the broker API.",
      url: "https://github.com/mrAbhimanyuVishwakarma/trading-bot",
      tech: ["Python", "Alpaca API", "TradingView", "AI/ML"],
      visibility: "Public"
    }
  ]);

  useEffect(() => {
    const checkRepoVisibility = async () => {
      const updatedRepos = await Promise.all(repos.map(async (repo) => {
        if (repo.url && repo.url.includes('github.com')) {
          try {
            const urlPath = new URL(repo.url).pathname.split('/').filter(Boolean);
            if (urlPath.length >= 2) {
              const owner = urlPath[0];
              const repoName = urlPath[1];
              const response = await fetch(`https://api.github.com/repos/${owner}/${repoName}`);
              
              if (response.status === 404) {
                return { ...repo, visibility: 'Private', url: null };
              }
            }
          } catch (error) {
            console.error('Failed to check repo visibility:', error);
          }
        }
        return repo;
      }));
      
      // Update only if changed
      if (JSON.stringify(repos) !== JSON.stringify(updatedRepos)) {
        setRepos(updatedRepos);
      }
    };
    checkRepoVisibility();
  }, []); // Run once on mount

  return (
    <section className="section" id="projects">
      <p className="section-label">Projects</p>
      <div className="projects-grid">
        {repos.map((repo, idx) => (
          <a key={idx} href={repo.url || "#"} target={repo.url ? "_blank" : "_self"} rel={repo.url ? "noopener noreferrer" : ""} className="project-card">
            <div className="project-header">
              <span className="project-number">{repo.id}</span>
              <div className="project-badges">
                <span className={`project-badge ${repo.visibility === 'Public' ? 'public' : 'private'}`}>{repo.visibility}</span>
                <span className="project-badge">{repo.id === "01" ? "Featured" : "In progress"}</span>
              </div>
            </div>
            <p className="project-title">{repo.title}</p>
            <p className="project-desc">{repo.desc}</p>
            <div className="project-tech">
              {repo.tech.map((t, i) => <span key={i}>{t}</span>)}
            </div>
            <span className="project-action">{repo.url ? "View Repository →" : "Private Repository"}</span>
          </a>
        ))}
      </div>
    </section>
  );
};

export default Projects;
