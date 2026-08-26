# ⚡ Abhimanyu Vishwakarma — Personal Portfolio

> **High-performance, cinematic developer portfolio website showcasing full-stack systems, engineering projects, desktop applications, and interactive web experiences.**

---

## 🌐 Live Demo & Quick Links

- **Live Website**: [https://mrabhimanyuvishwakarma.github.io/Portfolio/](https://mrabhimanyuvishwakarma.github.io/Portfolio/) *(or local deployment)*
- **GitHub Profile**: [@mrAbhimanyuVishwakarma](https://github.com/mrAbhimanyuVishwakarma)
- **LinkedIn**: [Abhimanyu Vishwakarma](https://www.linkedin.com/in/mrabhimanyuvishwakarma/)
- **Email**: [abhimanyuvishwakarma9228@gmail.com](mailto:abhimanyuvishwakarma9228@gmail.com)

---

## 🚀 Featured Projects

| Project | Description | Tech Stack | Links |
|---|---|---|---|
| **AxePower** | Modern Windows desktop application that automatically switches laptop power plans (Eco, Smart, Beast) based on charging state with safe powercfg integration. | `C#`, `.NET 8`, `WPF`, `MVVM` | [Live](https://axepower.vercel.app) • [Download](https://github.com/mrAbhimanyuVishwakarma/AxePower_Download/releases) • [GitHub](https://github.com/mrAbhimanyuVishwakarma/AxePower_Download.git) |
| **AxeDrobe** | Full-stack microservices e-commerce order management system with independent inventory, notification, and purchasing modules. | `Java`, `Spring Boot`, `React`, `Kafka`, `MySQL`, `Docker` | [Live](https://axedrobe-frontend.pages.dev/) • [GitHub](https://github.com/mrAbhimanyuVishwakarma/E-Commerce-Order-Management-System) |
| **Safarnama** | Immersive cinematic travel music web app recreating nostalgic journey atmospheres (trains, road trips, monsoon scenes) with procedural Web Audio soundscapes. | `React`, `Vite`, `Web Audio API`, `CSS3`, `IndexedDB` | [Live](https://safarnama-music.vercel.app) • [GitHub](https://github.com/mrAbhimanyuVishwakarma/mini-Music-Websites.git) |
| **SyncNotes** | Lightweight Chrome browser extension & mobile companion web app for floating sticky notes and cross-device document preview synchronization. | `JavaScript`, `Chrome Extension API`, `HTML5`, `PeerJS` | [Download](https://github.com/mrAbhimanyuVishwakarma/syncnotes-mobilehost/releases) • [GitHub](https://github.com/mrAbhimanyuVishwakarma/syncnotes-mobilehost) |
| **AuraTube** | Full-stack video processing utility with real-time SSE progress tracking, media conversion, and automated Google Drive upload workflows. | `Python`, `FastAPI`, `React`, `JavaScript`, `Docker` | [GitHub](https://github.com/mrAbhimanyuVishwakarma/AuraTube) |
| **HouseHelp_dgp** | Zero-latency, mobile-first web platform connecting households with verified domestic help, dynamic algorithmic pricing, and instant WhatsApp booking dispatch. | `JavaScript`, `HTML5`, `CSS3`, `Design Tokens`, `Vercel` | [Live](https://househelp-dgp.vercel.app/) • [GitHub](https://github.com/mrAbhimanyuVishwakarma/Househelp.git) |

---

## ✨ Key Features & Technical Highlights

- **Cinematic Ambient Video Backgrounds**: Dark and Light mode background video loops with a toggle controller in the social sidebar.
- **Lenis Smooth Scroll & Parallax**: Buttery-smooth scrolling with 3D perspective tilt, magnetic buttons, and parallax image hover interactions.
- **Dynamic Project Carousel**: Automatic Vite asset globbing (`import.meta.glob`) to cycle through project screenshots and mockups with keyboard and swipe support.
- **Live GitHub API Status Checker**: Dynamically checks repository visibility (Public / Private) in real-time via GitHub REST APIs.
- **Interactive Physics Mini-Game**: Built-in interactive draggable/kickable football game with realistic physics simulation.
- **Multi-Theme System**: Dynamic theme tokens supporting dark glassmorphic styling, high-contrast light mode, and customized accent presets.
- **Zero-Dependency Responsive Design System**: Handcrafted CSS variables, glassmorphism, responsive grid layouts, and custom media queries from 320px mobile to 4K displays.

---

## 🛠️ Tech Stack & Architecture

```text
+-------------------------------------------------------------+
|                        Client Layer                         |
|      (Desktop, Tablet, Mobile Browser Viewports 320px+)     |
+------------------------------+------------------------------+
                               |
                               v
+-------------------------------------------------------------+
|                     React 19 + Vite                         |
|  - App.jsx (Root, Lenis Observer, Theme Context, Video BG)  |
|  - Navbar & MobileMenu (Responsive Navigation & Avatar)     |
|  - Contact & Hero (Bio, Skills, Experience, Certifications) |
|  - Projects (Carousel, GitHub API Checker, Badges, Links)   |
|  - Football (Interactive Canvas / Physics Engine)           |
+------------------------------+------------------------------+
                               |
                               v
+-------------------------------------------------------------+
|                     Vanilla CSS Engine                      |
|  - index.css: Design tokens, glassmorphism, 3D transforms  |
|  - Dark/Light Theme Switching & Ambient Contrast Systems    |
+-------------------------------------------------------------+
```

### Core Technologies:
- **Frontend Framework**: React 19
- **Build Tool**: Vite 8
- **Smooth Scrolling**: Lenis (`@studio-freight/lenis`)
- **Styling**: Vanilla CSS3 (Custom Design Tokens, Glassmorphism, 3D Transforms, Responsive Media Queries)
- **Deployment**: Vercel / Cloudflare Pages / GitHub Pages

---

## 📁 Repository Structure

```text
Portfolio/
├── frontend/
│   ├── public/
│   │   ├── Background/           # Dark and Light mode video loops & posters
│   │   ├── My Work/              # High-res screenshots & mockups for projects
│   │   │   ├── axepower/
│   │   │   ├── axedrobe/
│   │   │   ├── safarnama/
│   │   │   ├── syncnotes/
│   │   │   ├── auratube/
│   │   │   └── househelp_dgp/
│   │   ├── Abhimanyu_Vishwakarma_Resume.pdf
│   │   └── mrAbhimanyu.png       # Avatar
│   ├── src/
│   │   ├── components/
│   │   │   ├── Contact.jsx       # Hero, summary, certs, skills, email
│   │   │   ├── Football.jsx      # Physics mini-game
│   │   │   ├── Footer.jsx        # Footer & privacy disclaimer
│   │   │   ├── MobileMenu.jsx    # Mobile slide-out drawer
│   │   │   ├── Navbar.jsx        # Sticky navigation header
│   │   │   ├── Projects.jsx      # Project showcase & carousel
│   │   │   ├── SocialSidebar.jsx # Fixed social links & video play/pause
│   │   │   └── ThemeToggle.jsx   # Theme switcher
│   │   ├── context/
│   │   │   └── ThemeContext.jsx  # Dark/Light theme state
│   │   ├── App.jsx               # Main orchestration & Lenis scroll
│   │   ├── index.css             # Comprehensive design system
│   │   └── main.jsx              # Entry point
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## 💻 Local Development Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher)
- npm, pnpm, or yarn

### Installation & Execution

```bash
# 1. Clone the repository
git clone https://github.com/mrAbhimanyuVishwakarma/Portfolio.git
cd Portfolio

# 2. Navigate to frontend directory
cd frontend

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev

# 5. Open in browser
# Local dev server runs at: http://localhost:5173/
```

### Production Build

```bash
# Generate optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 📄 License & Attribution

Designed and engineered with passion by **Abhimanyu Vishwakarma**.  
All rights reserved © 2026.
