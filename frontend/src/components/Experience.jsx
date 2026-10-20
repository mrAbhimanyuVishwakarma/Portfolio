import { 
  FaJava, 
  FaPython, 
  FaDocker, 
  FaAws, 
  FaGitAlt, 
  FaDatabase, 
  FaFileExcel, 
  FaCode, 
  FaServer, 
  FaTools, 
  FaTerminal, 
  FaChartBar, 
  FaChartPie, 
  FaFigma, 
  FaNetworkWired,
  FaReact,
  FaJs,
  FaHtml5,
  FaCss3Alt
} from 'react-icons/fa';
import { 
  SiSpringboot, 
  SiApachekafka, 
  SiMysql, 
  SiPostgresql, 
  SiMongodb, 
  SiPostman, 
  SiSwagger,
  SiClaude,
  SiKotlin,
  SiAndroidstudio,
  SiDavinciresolve,
  SiBlender,
  SiIntellijidea
} from 'react-icons/si';
import { VscCode } from 'react-icons/vsc';
import './Experience.css';

const approachesData = [
  {
    title: 'Planning First',
    desc: 'I believe in thorough planning and design before coding. Understanding requirements and mapping out solutions leads to better outcomes.',
    icon: FaFigma
  },
  {
    title: 'Working Together',
    desc: 'Collaboration and teamwork are at the heart of great software. I value open communication and shared knowledge to achieve common goals.',
    icon: FaGitAlt
  },
  {
    title: 'Hybrid Solutions',
    desc: 'I create versatile solutions that work across platforms and environments. Building adaptive systems that function anywhere, anytime.',
    icon: FaNetworkWired
  }
];

const TECH_ICONS = {
  'Java': FaJava,
  'Spring Boot': SiSpringboot,
  'Docker': FaDocker,
  'Kafka': SiApachekafka,
  'Python': FaPython,
  'REST APIs': FaServer,
  'AWS': FaAws,
  'MySQL': SiMysql,
  'PostgreSQL': SiPostgresql,
  'CI/CD': FaTools,
  'Maven': FaTerminal,
  'PowerShell': FaTerminal,
  'Swagger': SiSwagger,
  'Postman': SiPostman,
  'Git': FaGitAlt,
  'SQL': FaDatabase,
  'Power BI': FaChartBar,
  'Tableau': FaChartPie,
  'Excel': FaFileExcel,
};

const experiencesData = [
  {
    id: 'cognizant-sde',
    role: 'Software Development Engineer',
    company: 'Cognizant (Travelers Insurance)',
    period: 'July 2024 – Present',
    accentColor: '#0066FF',
    description: 'Engineered and containerized enterprise Java & Spring Boot microservices with Docker and Apache Kafka for event-driven workflows, boosting migration efficiency by 30% with a <0.1% defect rate. Automated Jira intake pipelines, artifact deployments, and comprehensive API testing suites using Python & PowerShell, cutting manual operational effort by 40%. Standardized end-to-end CI/CD release validations across UAT and production environments, leading root-cause analysis (RCA) to rapidly diagnose and resolve deployment anomalies.',
    technologies: [
      'Java',
      'Spring Boot',
      'Docker',
      'Kafka',
      'Python',
      'REST APIs',
      'MySQL',
      'AWS',
      'CI/CD'
    ]
  },
  {
    id: 'cognizant-da',
    role: 'Data Analyst Intern',
    company: 'Cognizant',
    period: 'January 2024 – June 2024',
    accentColor: '#0066FF',
    description: 'Developed automated ETL workflows and optimized SQL analytical models to transform raw business data into actionable reporting. Designed and deployed interactive executive dashboards using Power BI and Tableau for real-time performance tracking and data-driven decision-making.',
    technologies: [
      'SQL',
      'Python',
      'Power BI',
      'Tableau',
      'Excel'
    ]
  }
];

const skillCategoriesData = [
  {
    id: 'frontend',
    category: 'Frontend',
    skills: [
      { name: 'React', icon: FaReact },
      { name: 'JavaScript', icon: FaJs },
      { name: 'HTML', icon: FaHtml5 },
      { name: 'CSS', icon: FaCss3Alt },
      { name: 'Claude', icon: SiClaude }
    ]
  },
  {
    id: 'backend',
    category: 'Backend',
    skills: [
      { name: 'Java', icon: FaJava },
      { name: 'Kotlin', icon: SiKotlin },
      { name: 'Spring Boot', icon: SiSpringboot },
      { name: 'REST API', icon: FaServer },
      { name: 'Apache Kafka', icon: SiApachekafka },
      { name: 'MySQL', icon: SiMysql },
      { name: 'MongoDB', icon: SiMongodb },
      { name: 'PostgreSQL', icon: SiPostgresql }
    ]
  },
  {
    id: 'tools',
    category: 'Tools',
    skills: [
      { name: 'Git', icon: FaGitAlt },
      { name: 'Docker', icon: FaDocker },
      { name: 'Figma', icon: FaFigma },
      { name: 'VS Code', icon: VscCode },
      { name: 'IntelliJ', icon: SiIntellijidea },
      { name: 'Android Studio', icon: SiAndroidstudio },
      { name: 'DaVinci Resolve', icon: SiDavinciresolve },
      { name: 'Blender', icon: SiBlender }
    ]
  }
];

const Experience = () => {
  return (
    <section className="section">
      {/* 1. My Approach */}
      <div className="approach-section" id="approach">
        <p className="section-label">My Approach</p>
        <div className="approach-grid">
          {approachesData.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="approach-card">
                <div className="approach-icon-wrap">
                  <Icon className="approach-icon" />
                </div>
                <h3 className="approach-title">{item.title}</h3>
                <p className="approach-desc">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="divider" style={{ margin: '3.5rem 0' }}><hr /></div>

      {/* 2. My Experience */}
      <div id="experience" style={{ scrollMarginTop: '80px' }}>
        <p className="section-label">My Experience</p>

        {/* Vertical Timeline */}
        <div className="experience-timeline">
        {experiencesData.map((exp, idx) => (
          <div key={exp.id} className="timeline-entry" style={{ '--accent-color': exp.accentColor, '--anim-order': idx }}>
            {/* Node Indicator */}
            <div className="timeline-marker">
              <div className="timeline-node">
                <div className="node-pulse" />
              </div>
              {idx < experiencesData.length - 1 && <div className="timeline-trail" />}
            </div>

            {/* Timeline Card */}
            <div className="timeline-card">
              <div className="timeline-header">
                <div className="company-logo">
                  <img src="/cognizant-icon.svg" alt={`${exp.company} logo`} className="company-logo-img" />
                </div>
                <div className="timeline-header-text">
                  <h3 className="timeline-title">
                    {exp.role} <span className="timeline-company" style={{ color: exp.accentColor }}>@ {exp.company}</span>
                  </h3>
                  <div className="timeline-period">{exp.period}</div>
                </div>
              </div>

              {/* Summary Description (matching reference portfolio) */}
              <p className="timeline-description">{exp.description}</p>

              {/* Technologies Tags */}
              <div className="timeline-tech-tags">
                {exp.technologies.map((tech) => {
                  const IconComponent = TECH_ICONS[tech] || FaCode;
                  return (
                    <span key={tech} className="exp-tech-tag">
                      <IconComponent className="exp-tech-icon" />
                      <span>{tech}</span>
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
        </div>
      </div>

      <div className="divider" style={{ margin: '3.5rem 0' }}><hr /></div>

      {/* 3. Technologies & Skills (Clean 3-column layout without radio filter) */}
      <div className="skills-section-block">
        <p className="section-label">My Skills</p>

        {/* 3-Column Grid */}
        <div className="skills-grid-container">
          {skillCategoriesData.map((cat) => (
            <div key={cat.id} className="skill-category-card">
              <h4 className="skill-category-title">{cat.category}</h4>
              <div className="skill-pills-wrap">
                {cat.skills.map((s) => {
                  const Icon = s.icon;
                  return (
                    <span key={s.name} className="skill-pill-badge">
                      <Icon className="skill-pill-icon" />
                      <span>{s.name}</span>
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
