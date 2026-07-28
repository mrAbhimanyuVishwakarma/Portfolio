import React, { useEffect, useRef, useState } from 'react';

const Projects = () => {
  const [repos, setRepos] = useState([
    {
      id: "01",
      title: "AxeDrobe (E-Commerce Order Management)",
      desc: "Built full-stack e-commerce order management system with independent user, product, purchase, inventory, notification modules. Implemented Fast APIs using Java, Spring Boot, Typescript, MySQL, JPA-Hibernate, JWT authentication, oauth login, Kafka event flow, Docker setup. Integrated a React frontend with server-side to support product browsing, checkout placement, inventory updates, and scalable SIP communication.",
      url: "https://github.com/mrAbhimanyuVishwakarma/E-Commerce-Order-Management-System",
      liveUrl: "https://axedrobe-frontend.pages.dev/",
      tech: ["Java", "Spring Boot", "React", "CSS", "Kafka", "MySQL"],
      visibility: "Public"
    },
    {
      id: "02",
      title: "AuraTube",
      desc: "Built a full-stack video utility application using React front-end development and FastAPI layer for YouTube video and playlist workflow execution. Integrated yt-dlp, FFmpeg, Google APIs, and Server-Sent Events to improve video processing, real-time progress tracking, and Google Drive upload.",
      url: "https://github.com/mrAbhimanyuVishwakarma/AuraTube",
      liveUrl: "https://aura-tube-eight.vercel.app/",
      tech: ["Python", "FastAPI", "Angular", "Node.js", "React"],
      visibility: "Public"
    },
    {
      id: "03",
      title: "Developer Portfolio",
      desc: "A highly interactive personal portfolio built with React and Vite. Features custom 3D mouse tracking animations, smooth scrolling with Lenis, and dynamic GitHub API integration to automatically sync and display public repositories.",
      url: "https://github.com/mrAbhimanyuVishwakarma/Portfolio",
      liveUrl: "https://portfolio-beta-amber-6xpiu6ljay.vercel.app/",
      tech: ["React", "Vite", "Lenis Scroll", "CSS"],
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

              if (response.status === 200) {
                return { ...repo, visibility: 'Public' };
              } else if (response.status === 404) {
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
    <section className="section" id="work">
      <p className="section-label">My Work</p>
      <div className="projects-grid">
        {repos.map((repo, idx) => (
          <div
            key={idx}
            className={`project-card ${!repo.url ? 'private-card' : ''}`}
          >
            <div className="project-header">
              <span className="project-number">{repo.id}</span>
              <div className="project-badges">
                <span className={`project-badge ${repo.visibility === 'Public' ? 'public' : 'private'} repo-visibility-badge`}>{repo.visibility}</span>
              </div>
            </div>
            <p className="project-title">{repo.title}</p>
            <p className="project-desc">{repo.desc}</p>
            <div className="project-tech">
              {repo.tech.map((t, i) => <span key={i}>{t}</span>)}
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto', paddingTop: '8px' }}>
              {repo.liveUrl && (
                <a href={repo.liveUrl} target="_blank" rel="noopener noreferrer" className="project-action" style={{ marginTop: 0, paddingTop: 0, textDecoration: 'none' }}>Live →</a>
              )}
              {repo.url ? (
                <a href={repo.url} target="_blank" rel="noopener noreferrer" className="project-action" style={{ marginTop: 0, paddingTop: 0, textDecoration: 'none' }}>Repository →</a>
              ) : (
                <span className="project-action" style={{ marginTop: 0, paddingTop: 0 }}>Private Repository</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;
