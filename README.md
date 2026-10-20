# Abhimanyu Vishwakarma — Portfolio

> **Software Development Engineer & Systems Builder.** Based in Bengaluru, India 🇮🇳

The personal portfolio of **Abhimanyu Vishwakarma**, showcasing full-stack systems, microservices, desktop utilities, and interactive web applications.

<p align="center">
  <a href="https://mrabhimanyu.vercel.app"><strong>🌐 Visit the Live Site →</strong></a>
</p>

---

## What You'll Find on the Site

- **About Me**: Professional introduction, LinkedIn profile card, and downloadable resume.
- **Experience**: Timeline detailing enterprise microservices development at Cognizant (Travelers Insurance) and data analytics workflows.
- **Projects**: Interactive showcase of featured engineering projects with image carousels, live GitHub visibility tags, and direct deployment links.
- **Arcade**: Interactive web mini-games including 2D F1 Racing, Fighter Jet Dogfight, and a physics-based football field.
- **Contact**: Direct email trigger, contact modal, and social connection links.

---

## Featured Projects

| Project | What It Is | Tech Stack |
|---|---|---|
| [**AxeDrobe**](https://axedrobe.vercel.app/) | Full-stack e-commerce order management system with independent inventory, notification, and purchasing modules. | `Java`, `Spring Boot`, `React`, `Kafka`, `MySQL`, `Docker` |
| [**AxePower**](https://axepower.vercel.app) | Windows desktop utility that automatically switches laptop power plans (Eco, Smart, Beast) based on charging state. | `C#`, `.NET 8`, `WPF`, `MVVM` |
| [**SmoothCam**](https://smoothcam.vercel.app) | Virtual webcam software boosting camera feeds up to 60 FPS and 4K via motion-estimated frame interpolation. | `C++`, `DirectShow`, `DirectML`, `OpenCV`, `DirectX 11` |
| [**Safarnama**](https://safarnama-music.vercel.app) | Nostalgic travel music application simulating road trips and monsoon journeys using procedural Web Audio soundscapes. | `React`, `Vite`, `Web Audio API`, `CSS3` |
| [**SyncNotes**](https://github.com/mrAbhimanyuVishwakarma/syncnotes-mobilehost) | Browser extension and mobile companion app for floating notes and cross-device document sync. | `JavaScript`, `Chrome Extension API`, `PeerJS` |
| [**AuraTube**](https://github.com/mrAbhimanyuVishwakarma/AuraTube) | Full-stack media utility with real-time SSE progress tracking and automated Google Drive upload workflows. | `Python`, `FastAPI`, `React`, `Docker` |
| [**HouseHelp_dgp**](https://househelp-dgp.vercel.app/) | Mobile-first platform connecting households with verified domestic services and dynamic pricing. | `JavaScript`, `HTML5`, `CSS3`, `Design Tokens` |

---

## Features

- 🌗 **Light & Dark Theme**: High-contrast, sleek dark mode and warm stone light mode with saved `localStorage` preferences.
- 🎥 **Cinematic Ambient Video Background**: Dual-theme video loops with a play/pause toggle.
- 🎨 **Dynamic Mesh & Grid Fallback**: Automatic pure CSS 15-second animated mesh gradient and 32px geometric grid overlay revealed whenever the background video is paused.
- 📱 **Fully Responsive Layout**: Custom responsive breakpoints tailored for standard phones, flip phones / foldables, tablets, and 4K monitors.
- 🕹️ **Integrated Arcade**: Custom interactive canvas games with audio effects and physics simulations.
- ✨ **Smooth Interactions**: Butter-smooth scrolling with Lenis, 3D perspective card tilt, and magnetic hover effects.

---

## Tech Stack

- **Frontend**: React 19, Vite 8
- **Styling**: Vanilla CSS3 (Custom Design Tokens, Glassmorphism, CSS Grid & Flexbox)
- **Smooth Scroll**: Lenis (`@studio-freight/lenis`)
- **Icons**: `react-icons`
- **Deployment & Container**: Docker (Multi-stage build) · Nginx Alpine · Vercel

---

## Running Locally

```bash
# 1. Clone the repository
git clone https://github.com/mrAbhimanyuVishwakarma/Portfolio.git
cd Portfolio/frontend

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

| Script | What It Does |
|---|---|
| `npm run dev` | Starts Vite local development server (`http://localhost:5173`) |
| `npm run build` | Compiles optimized production bundle into `dist/` |
| `npm run preview` | Previews the production build locally |
| `npm run lint` | Runs ESLint code quality checks |

---

## Docker Deployment

Build and run the production-ready container locally using Docker:

### Using Docker Compose (Recommended)
```bash
docker compose up -d --build
```
Access the portfolio at `http://localhost:8080`.

### Using Docker CLI
```bash
# Build image
docker build -t abhimanyu-portfolio .

# Run container
docker run -d -p 8080:80 --name abhimanyu-portfolio abhimanyu-portfolio
```

---

## Get in Touch

- 🌐 **Website**: [mrabhimanyu.vercel.app](https://mrabhimanyu.vercel.app)
- 💼 **LinkedIn**: [linkedin.com/in/mrabhimanyu](https://www.linkedin.com/in/mrabhimanyu/)
- 🐙 **GitHub**: [github.com/mrAbhimanyuVishwakarma](https://github.com/mrAbhimanyuVishwakarma)
- ✉️ **Email**: [abhimanyuvishwakarma9228@gmail.com](mailto:abhimanyuvishwakarma9228@gmail.com)

---

<sub>© 2026 Abhimanyu Vishwakarma. Built with care.</sub>
