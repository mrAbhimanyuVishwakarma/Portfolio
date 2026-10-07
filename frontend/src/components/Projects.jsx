import React, { useEffect, useRef, useState } from 'react';

const ProjectCarousel = ({ images, title, link }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);

  const handleScroll = (e) => {
    const scrollLeft = e.target.scrollLeft;
    const width = e.target.clientWidth;
    if (width > 0) {
      const newIndex = Math.round(scrollLeft / width);
      setActiveIndex(newIndex);
    }
  };

  const scrollTo = (index) => {
    if (scrollRef.current) {
      const width = scrollRef.current.clientWidth;
      scrollRef.current.scrollTo({ left: width * index, behavior: 'smooth' });
    }
  };

  return (
    <div className="project-carousel" style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', borderRadius: 'inherit' }}>
      <div
        className="carousel-track"
        ref={scrollRef}
        onScroll={handleScroll}
        style={{ display: 'flex', width: '100%', height: '100%', overflowX: 'auto', scrollSnapType: 'x mandatory', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
      >
        {images.map((img, idx) => (
          <a
            key={idx}
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="carousel-slide"
            style={{ flex: '0 0 100%', width: '100%', height: '100%', scrollSnapAlign: 'start', display: 'block', position: 'relative' }}
          >
            <img src={img} alt={`${title} screenshot ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </a>
        ))}
      </div>
      {images.length > 1 && (
        <div className="carousel-dots" style={{ position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px', zIndex: 10 }}>
          {images.map((_, idx) => (
            <button
              key={idx}
              className={`carousel-dot ${activeIndex === idx ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); scrollTo(idx); }}
              aria-label={`View image ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
const allProjectImages = import.meta.glob('/public/My Work/*/*.{png,jpg,jpeg,webp,gif,svg}');

const getProjectImages = (folderName) => {
  const images = Object.keys(allProjectImages)
    .filter(path => path.toLowerCase().includes(`/public/my work/${folderName.toLowerCase()}/`))
    .map(path => path.replace('/public', ''));

  // Sort alphabetically so dark/light orders remain consistent
  return images.sort();
};

const Projects = () => {
  const [repos, setRepos] = useState([
    {
      title: "AxeDrobe",
      desc: [
        "Built full-stack e-commerce order management system with independent user, product, purchase, inventory, notification modules for end-to-end workflow execution.",
        "Implemented Fast APIs using Java, Spring Boot, Typescript, MySQL, JPA-Hibernate, JWT authentication, oauth login, Kafka event flow communicate, Docker setup, and API documentation.",
        "Integrated a React frontend with server-side to support product browsing, checkout placement, inventory updates, and scalable microservices communication."
      ],
      url: "https://github.com/mrAbhimanyuVishwakarma/E-Commerce-Order-Management-System",
      liveUrl: "https://axedrobe.vercel.app/",
      tech: ["Java", "Spring Boot", "React", "Kafka", "MySQL", "Docker"],
      visibility: "Public",
      images: getProjectImages("axedrobe")
    },
    {
      title: "AxePower",
      desc: [
        "Built a modern Windows desktop application to automatically optimize laptop power plans based on charger connection status, featuring Eco, Smart, and Beast modes.",
        "Developed using C#, WPF, and .NET 8 with a premium Fluent Dark UI. Implemented strict MVVM architecture, background auto-switching, and safe powercfg modifications."
      ],
      url: "https://github.com/mrAbhimanyuVishwakarma/AxePower_Download.git",
      liveUrl: "https://axepower.vercel.app",
      downloadUrl: "https://github.com/mrAbhimanyuVishwakarma/AxePower_Download/releases",
      tech: ["C#", ".NET 8", "WPF", "MVVM"],
      visibility: "Public",
      images: getProjectImages("axepower")
    },
    {
      title: "Safarnama",
      desc: [
        "Architected an immersive cinematic travel music web application recreating nostalgic journey atmospheres (trains, road trips, monsoon scenes) with procedural soundscape synthesis.",
        "Engineered multi-source playback (YouTube streams & IndexedDB audio storage), algorithmic ambient sound synthesis (rail clatter, horn, rain), and a responsive glassmorphic UI."
      ],
      url: "https://github.com/mrAbhimanyuVishwakarma/mini-Music-Websites.git",
      liveUrl: "https://safarnama-music.vercel.app",
      tech: ["React", "Vite", "Web Audio API", "CSS", "IndexedDB"],
      visibility: "Public",
      images: getProjectImages("safarnama")
    },
    {
      title: "SyncNotes",
      desc: [
        "Developed a lightweight Chrome browser extension and mobile companion web application for instant sticky notes and synchronized document previews across devices.",
        "Implemented zero-latency draggable floating UI, autosaving state persistence, PeerJS-powered real-time synchronization, and multi-format document preview support."
      ],
      url: "https://github.com/mrAbhimanyuVishwakarma/syncnotes-mobilehost",
      downloadUrl: "https://github.com/mrAbhimanyuVishwakarma/syncnotes-mobilehost/releases",
      liveUrl: null,
      tech: ["JavaScript", "Chrome Extension API", "HTML5", "CSS", "PeerJS"],
      visibility: "Public",
      images: getProjectImages("syncnotes")
    },
    {
      title: "AuraTube",
      desc: [
        "Built a full-stack video utility application using React front-end development and FastAPI layer for YouTube video and playlist workflow execution. Designed applications for handling video requests, handling status updates, file operations, and smooth frontend-backend communication.",
        "Integrated yt-dlp, FFmpeg, Google APIs, and Server-Sent Events to improve video processing, real-time progress tracking, and Google Drive upload."
      ],
      url: "https://github.com/mrAbhimanyuVishwakarma/AuraTube",
      liveUrl: null,
      tech: ["Python", "FastAPI", "JavaScript", "Docker", "OAuth 2.0", "React"],
      visibility: "Public",
      images: getProjectImages("auratube")
    },
    {
      title: "HouseHelp_dgp",
      desc: [
        "Engineered a zero-latency, mobile-first web platform connecting households with background-verified domestic help (cooks, housemaids, babysitters, elderly caretakers) in Durgapur.",
        "Implemented a real-time dynamic pricing calculation engine based on municipal living indices, quick-match booking funnels, and instant WhatsApp booking dispatch."
      ],
      url: "https://github.com/mrAbhimanyuVishwakarma/Househelp.git",
      liveUrl: "https://househelp-dgp.vercel.app/",
      tech: ["JavaScript", "HTML5", "CSS", "Vercel"],
      visibility: "Public",
      images: getProjectImages("househelp_dgp")
    }
  ]);

  useEffect(() => {
    const checkRepoVisibility = async () => {
      const updatedRepos = await Promise.all(repos.map(async (repo) => {
        if (repo.url && repo.url.includes('github.com')) {
          try {
            const cleanPathname = new URL(repo.url).pathname.replace(/\.git$/, '');
            const urlPath = cleanPathname.split('/').filter(Boolean);
            if (urlPath.length >= 2) {
              const owner = urlPath[0];
              const repoName = urlPath[1];
              const response = await fetch(`https://api.github.com/repos/${owner}/${repoName}`);

              if (response.status === 200) {
                return { ...repo, visibility: 'Public' };
              } else if (response.status === 404) {
                return { ...repo, visibility: 'Private' };
              }
            }
          } catch (error) {
            console.error('Failed to check repo visibility:', error);
          }
        }
        return repo;
      }));

      if (JSON.stringify(repos) !== JSON.stringify(updatedRepos)) {
        setRepos(updatedRepos);
      }
    };
    checkRepoVisibility();
  }, []);

  return (
    <section className="section" id="work">
      <p className="section-label">My Work</p>
      <div className="projects-grid">
        {repos.map((repo, idx) => (
          <div
            key={idx}
            className={`project-card ${!repo.url ? 'private-card' : ''}`}
          >
            <div className="project-image-container">
              <ProjectCarousel images={repo.images} title={repo.title} link={repo.liveUrl || repo.url} />
            </div>
            <div className="project-content">
              <div className="project-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <p className="project-title" style={{ margin: 0 }}>{repo.title}</p>
                <div className="project-badges">
                  <span className={`project-badge ${repo.visibility === 'Public' ? 'public' : 'private'} repo-visibility-badge`}>{repo.visibility}</span>
                </div>
              </div>
              <ul className="project-desc" style={{ listStyleType: 'disc', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {repo.desc.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
              <div className="project-tech">
                {repo.tech.map((t, i) => <span key={i}>{t}</span>)}
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto', paddingTop: '8px' }}>
                {repo.liveUrl && (
                  <a href={repo.liveUrl} target="_blank" rel="noopener noreferrer" className="project-action" style={{ marginTop: 0, paddingTop: 0, textDecoration: 'none' }}>Live →</a>
                )}
                {repo.downloadUrl && (
                  <a href={repo.downloadUrl} target="_blank" rel="noopener noreferrer" className="project-action" style={{ marginTop: 0, paddingTop: 0, textDecoration: 'none' }}>Download →</a>
                )}
                {repo.url ? (
                  <a href={repo.url} target="_blank" rel="noopener noreferrer" className="project-action" style={{ marginTop: 0, paddingTop: 0, textDecoration: 'none' }}>
                    {repo.visibility === 'Private' ? 'Private GitHub →' : 'GitHub →'}
                  </a>
                ) : (
                  <span className="project-action" style={{ marginTop: 0, paddingTop: 0 }}>Private GitHub</span>
                )}
              </div>
            </div>
          </div>
        ))}
        <a
          href="https://github.com/mrAbhimanyuVishwakarma?tab=repositories"
          target="_blank"
          rel="noopener noreferrer"
          className="more-projects-bar"
        >
          <div className="more-projects-left">
            <div className="more-projects-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
            </div>
            <div className="more-projects-text-group">
              <span className="more-projects-title">See more projects from me</span>
              <span className="more-projects-subtitle">Explore repositories, open-source utilities & experiments on GitHub</span>
            </div>
          </div>
          <div className="more-projects-action">
            <span>Explore on GitHub</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </div>
        </a>
      </div>
    </section>
  );
};

export default Projects;
