# Portfolio Web Application

## Project Overview

A modern, interactive personal portfolio website built to showcase projects, skills, and experience. It features smooth scrolling, 3D tilt effects, magnetic buttons, and a mini-game. It is designed using the Vercel Web Design Guidelines.

---

## Architecture

```text
+-------------------+
|      Client       |
|   (Web Browser)   |
+---------+---------+
          |
          v
+-------------------+
|    Portfolio UI   |
|   (React + Vite)  |
+---------+---------+
          |
          v
+-------------------+
|   Design System   |
| (Vercel Elements) |
+-------------------+
```

---

## Features

- **Smooth Scrolling**: Implemented using Lenis for an immersive experience.
- **3D & Magnetic Effects**: Interactive elements that react to mouse movements.
- **Mini-Game**: An interactive physics-based football/basketball mini-game at the bottom.
- **Theme Toggle**: Multiple theme options for customization.
- **Social Sidebar**: Quick access to social links.

---

## Flowchart

```text
User Lands on Site
       |
       v
  Hero Section
       |
       v
 Scroll Down (Lenis Smooth Scroll)
       |
       v
 View Experience & Projects
       |
       v
 Interact with 3D Cards
       |
       v
 Contact / Footer / Mini-Game
```

---

## Structure

### 1. Frontend

**Responsibilities**

* Renders UI Components (Navbar, Hero, Cards, Games).
* Handles animations, physics (game logic), and smooth scrolling.
* Integrates the Vercel-inspired design system (`DESIGN.md`).

### 2. Design System

**Responsibilities**

* Ensures consistent typography, spacing, and dark mode aesthetics.
* Maintained via Vercel Web Design Guidelines.
