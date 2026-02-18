# ARUONA - Travel-Through-Style Discovery Platform

## Overview
A globe-first, luxury fashion discovery web application where users explore curated fashion from cities around the world. Premium pastel aesthetic with interactive 3D globe. The core loop is "travel through style" — selecting a city drives the entire page experience.

## Recent Changes
- 2026-02-18: Initial MVP build with full landing page dashboard
- 2026-02-18: Transformed from shopping app to travel-through-style:
  - Globe-first behavior: selectedCity (default Paris) drives hero, curated picks, and Style Passport
  - Added Style Passport panel tracking visited cities
  - Vibes row (Parisian Chic, Minimal Summer, Quiet Luxury, Tokyo Streetwear) as primary filter
  - Aruona-specific language: "Explore" not "Search", "Refine" not "Filter", "Current Moods" not "Trending"
  - AnimatePresence transitions when changing city/filters
  - Toast notifications "Now exploring: {city}" on city change
  - Products now include `vibe` field in schema and seed data
  - 12 products seeded across 7 cities

## Tech Stack
- **Frontend**: React + TypeScript + Vite + TailwindCSS + Framer Motion
- **Backend**: Express.js + PostgreSQL + Drizzle ORM
- **State**: Zustand for client state (favorites, filters, search, visitedCities, selectedVibe)
- **Globe**: cobe library for interactive 3D globe
- **UI**: Shadcn components with custom pastel theme

## Project Architecture
- `client/src/pages/home.tsx` - Main landing dashboard with filtering logic
- `client/src/components/` - All UI components
  - `globe-section.tsx` - 3D globe + city markers + Style Passport
  - `main-content.tsx` - Hero banner (selectedCity driven) + city cards
  - `curated-picks.tsx` - Filtered product grid with AnimatePresence
  - `search-bar.tsx` - Vibes row + categories + search input
  - `app-sidebar.tsx` - "Current Moods" + "Picked For You"
  - `floating-action-bar.tsx` - Bottom action bar (Refine/Explore Map/Adjust)
  - `newsletter.tsx` - Newsletter subscription form
  - `trending-cities.tsx` - Destinations list (clickable, drives selectedCity)
- `client/src/lib/store.ts` - Zustand global state (selectedCity, selectedVibe, visitedCities)
- `client/src/lib/mock-data.ts` - Fallback data and constants (VIBES, PRODUCTS with vibe field)
- `server/routes.ts` - API endpoints (/api/products, /api/cities, /api/newsletter)
- `server/storage.ts` - Database storage with seed data (12 products with vibe)
- `shared/schema.ts` - Database schema (cities, products with vibe field, categories, newsletters)

## Design Tokens
- Fonts: Playfair Display (serif/logo), Inter (sans/UI)
- Accent color: #F0C4A8 (warm peach)
- Soft pastel gradients, glassmorphism cards, rounded corners
- Dark mode support via CSS variables

## Key Behaviors
- selectedCity defaults to "Paris" and always filters curated picks
- Clicking city cards, globe markers, or destination rows changes selectedCity
- City changes trigger: hero banner update, curated picks filter, toast notification, Style Passport update
- Vibes are primary discovery filter; categories are secondary
- Style Passport tracks visitedCities with "Clear" reset option
- **Travel Mode**: "Explore Map" button opens full-screen overlay with expanded globe
  - Glassmorphism stage (~80vh), darkened backdrop with blur
  - City markers + destinations sidebar with progress bar
  - Auto-closes ~700ms after city selection
  - Close via: X button, Escape key, or backdrop click
  - Body scroll locked during overlay; aria-modal dialog

## User Preferences
- Luxury editorial aesthetic
- Globe-first exploration (travel-through-style, not shopping)
- Calm discovery tone in all UI copy
- No basic e-commerce grid look
