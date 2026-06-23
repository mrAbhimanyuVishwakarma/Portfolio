# Portfolio Web Application

## Project Overview

A modern, interactive personal portfolio website built to showcase projects, skills, and experience. It features smooth scrolling, 3D tilt effects, and is designed using the Vercel Web Design Guidelines.

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
 Contact / Footer
```

---

## Structure

### 1. Frontend

**Responsibilities**

* Renders UI Components (Navbar, Hero, Cards).
* Handles animations and smooth scrolling.
* Integrates the Vercel-inspired design system (`DESIGN.md`).

### 2. Design System

**Responsibilities**

* Ensures consistent typography, spacing, and dark mode aesthetics.
* Maintained via Vercel Web Design Guidelines.
