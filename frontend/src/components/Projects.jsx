import React, { useEffect, useRef, useState } from 'react';

const Projects = () => {
  const [repos, setRepos] = useState([
    {
      id: "01",
      title: "ClipStudio.AI",
      desc: "Automatically transform YouTube videos into viral-ready short-form clips with AI-powered analysis, stylish captions, background music, and direct YouTube uploads.",
      url: "https://github.com/mrAbhimanyuVishwakarma/Full_Youtube_video-shorts_maker",
      tech: ["Python", "AI/ML", "Video Editing", "Automation"],
      visibility: "Public"
    },
    {
      id: "02",
      title: "Student.AI",
      desc: "AI-powered educational platform featuring knowledge extraction from textbooks, assignments generations, projects report generations and personalized study guidance.",
      url: "https://github.com/mrAbhimanyuVishwakarma/Student.ai",
      tech: ["Python", "NodeJS", "MongoDB", "React", "AI/ML"],
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
    <section className="section" id="projects">
      <p className="section-label">Projects</p>
      <div className="projects-grid">
        {repos.map((repo, idx) => (
          <a
            key={idx}
            href={repo.url || undefined}
            target={repo.url ? "_blank" : undefined}
            rel={repo.url ? "noopener noreferrer" : undefined}
            className={`project-card ${!repo.url ? 'private-card' : ''}`}
            style={!repo.url ? { cursor: 'default' } : {}}
            onClick={(e) => {
              if (!repo.url) {
                e.preventDefault();
              }
            }}
          >
            <div className="project-header">
              <span className="project-number">{repo.id}</span>
              <div className="project-badges">
                <span className={`project-badge ${repo.visibility === 'Public' ? 'public' : 'private'} repo-visibility-badge`}>{repo.visibility}</span>
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
