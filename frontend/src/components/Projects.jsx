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
        "Integrated a React frontend with server-side to support product browsing, checkout placement, inventory updates, and scalable SIP communication for the customer."
      ],
      url: "https://github.com/mrAbhimanyuVishwakarma/E-Commerce-Order-Management-System",
      liveUrl: "https://axedrobe-frontend.pages.dev/",
      tech: ["Java", "Spring Boot", "React", "CSS", "Kafka", "MySQL"],
      visibility: "Public",
      images: getProjectImages("axedrobe")
    },
    {
      title: "AuraTube",
      desc: [
        "Built a full-stack video utility application using React front-end development and FastAPI layer for YouTube video and playlist workflow execution. Designed applications for handling video requests, handling status updates, file operations, and smooth frontend-backend communication.",
        "Integrated yt-dlp, FFmpeg, Google APIs, and Server-Sent Events to improve video processing, real-time progress tracking, and Google Drive upload."
      ],
      url: "https://github.com/mrAbhimanyuVishwakarma/AuraTube",
      liveUrl: "https://aura-tube-eight.vercel.app/",
      tech: ["Python", "JavaScript", "Docker", "Oauth 2.0", "CSS", "React"],
      visibility: "Public",
      images: getProjectImages("auratube")
    },
    {
      title: "AxePower",
      desc: [
        "Built a modern Windows desktop application to automatically optimize laptop power plans based on charger connection status, featuring Eco, Smart, and Beast modes.",
        "Developed using C#, WPF, and .NET 8 with a premium Fluent Dark UI. Implemented strict MVVM architecture, background auto-switching, and safe powercfg modifications."
      ],
      url: "https://github.com/mrAbhimanyuVishwakarma/AxePower_Download",
      liveUrl: null,
      downloadUrl: "https://github.com/mrAbhimanyuVishwakarma/AxePower_Download/releases",
      tech: ["C#", ".NET 8"],
      visibility: "Public",
      images: getProjectImages("axepower")
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
                {repo.downloadUrl && (
                  <a href={repo.downloadUrl} target="_blank" rel="noopener noreferrer" className="project-action" style={{ marginTop: 0, paddingTop: 0, textDecoration: 'none' }}>Download →</a>
                )}
                {repo.liveUrl && (
                  <a href={repo.liveUrl} target="_blank" rel="noopener noreferrer" className="project-action" style={{ marginTop: 0, paddingTop: 0, textDecoration: 'none' }}>Live →</a>
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
      </div>
    </section>
  );
};

export default Projects;
