# BrightPath Academy — Portfolio Website

A professional, modern single-page portfolio website for an educational organization offering courses, seminars, student activities, and learning opportunities.

## Features

- **Hero section** — "Empowering Students Through Knowledge and Opportunity" with dual CTAs
- **About & Mission** — organization introduction with mission statement and value checklist
- **Courses** — 8 courses with descriptions, duration, level, instructor, price, and enroll buttons; category filter (Business / Technology / Design / Science / Arts)
- **Seminars & Workshops** — 5 upcoming events with dates, speakers, locations, times, and registration buttons
- **Student Activities** — clubs, competitions, and community programs
- **Image Gallery** — 8-image masonry-style grid with a keyboard-accessible lightbox
- **Testimonials** — auto-advancing slider with arrows, dots, and touch swipe support
- **Team** — instructors and organization leaders
- **Statistics** — animated counters (students, courses, seminars, graduates)
- **News & Events** — latest articles
- **Contact** — address, email, phone, social links, embedded map, and a validated contact form

## Design

- Palette: navy blue (`#0b1f3a`), white, light gray (`#f4f6fa`), bright orange accent (`#f97316` / `#c2410c`)
- Typography: Sora (headings) + Inter (body) via Google Fonts
- Fully responsive: desktop, tablet, and mobile (hamburger menu, adaptive grids)
- Smooth animations: scroll-reveal, hover lifts, gradient text, animated counters
- Accessibility: skip link, ARIA labels, focus-visible states, keyboard navigation, `prefers-reduced-motion` support, AA contrast ratios
- SEO: semantic HTML5, meta description, Open Graph tags, JSON-LD `EducationalOrganization` structured data
- Performance: lazy-loaded images, `decoding="async"`, no framework dependencies, graceful image fallbacks

## Files

| File | Purpose |
|------|---------|
| `index.html` | Structure, content, and SEO metadata |
| `styles.css` | All styling, responsive breakpoints, animations |
| `script.js` | Navigation, filters, slider, lightbox, counters, form validation |

## Usage

Open `index.html` in any modern browser — no build step or server required.

> **Note:** Images are loaded from Unsplash and fonts from Google Fonts, so an internet connection is needed for the full visual experience. If images fail to load, branded SVG placeholders appear automatically.
