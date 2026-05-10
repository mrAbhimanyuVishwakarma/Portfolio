# Portfolio Development Log

## Goal
Refactor the personal portfolio website (`index_beta.html`) to improve maintainability and make the source code less readable/accessible directly via the browser's "View Source" (Ctrl+U).

## Current State
- The website is currently built as a single file (`index_beta.html`).
- All HTML, CSS (1000+ lines), and JavaScript are contained within this single file.
- The user is concerned that the source code is entirely visible and easy to read.

## Discussions & Decisions
- **Source Code Visibility**: Discussed that frontend code can never be completely hidden from the browser. However, using a bundler/minifier or a modern framework (like React/Vite) can bundle the code into a single, scrambled/minified JavaScript file. This results in the HTML file showing almost nothing when "View Source" is used.
- **Refactoring Options Presented**:
  1. **Vite + React (Recommended)**: Allows componentizing the UI (Bars, Cards, Body, etc.) into separate files and naturally obfuscates the code upon production build.
  2. **Vanilla Split**: Simply moving CSS and JS to external files (`style.css`, `main.js`) to clean up the HTML, though it remains readable unless manually minified.

## TODOs (Proposed & Completed)
- [x] Decide on the refactoring approach (Vite+React vs. Vanilla HTML/CSS/JS Split). -> Selected Vite+React
- [x] Set up the new project structure (e.g., `frontend/` folder).
- [x] Extract the CSS styling from `index_beta.html` into its own file/module.
- [x] Extract the JavaScript logic (animations, scroll spy, 3D tilt) into its own file/module (converted to React hooks).
- [x] Componentize the HTML structure (Navbar, Hero, Experience, Projects, Footer).
- [x] Test the new structure to ensure all animations and styles work exactly as they did in `index_beta.html`.
- [x] Build the production version to verify the obfuscation/minification.

## File References
- Staging file: `index_beta.html`
- Original file: `index.html` (to be updated once staging is finalized)
