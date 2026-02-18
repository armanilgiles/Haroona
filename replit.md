# ARUONA - Luxury Fashion Discovery Platform

## Overview
A globe-first, luxury fashion discovery web application where users explore curated fashion from cities around the world. Premium pastel aesthetic with interactive 3D globe.

## Recent Changes
- 2026-02-18: Initial MVP build with full landing page dashboard
- Globe visualization using cobe library
- Product filtering by city, category, style, and search
- Newsletter subscription with PostgreSQL persistence
- Database seeded with cities and products

## Tech Stack
- **Frontend**: React + TypeScript + Vite + TailwindCSS + Framer Motion
- **Backend**: Express.js + PostgreSQL + Drizzle ORM
- **State**: Zustand for client state (favorites, filters, search)
- **Globe**: cobe library for interactive 3D globe
- **UI**: Shadcn components with custom pastel theme

## Project Architecture
- `client/src/pages/home.tsx` - Main landing dashboard
- `client/src/components/` - All UI components (navbar, search, globe, curated picks, etc.)
- `client/src/lib/store.ts` - Zustand global state
- `client/src/lib/mock-data.ts` - Fallback data and constants
- `server/routes.ts` - API endpoints (/api/products, /api/cities, /api/newsletter)
- `server/storage.ts` - Database storage with seed data
- `server/db.ts` - PostgreSQL connection via drizzle-orm
- `shared/schema.ts` - Database schema (cities, products, categories, newsletters)

## Design Tokens
- Fonts: Playfair Display (serif/logo), Inter (sans/UI)
- Accent color: #F0C4A8 (warm peach)
- Soft pastel gradients, glassmorphism cards, rounded corners
- Dark mode support via CSS variables

## User Preferences
- Luxury editorial aesthetic
- Globe-first exploration
- No basic e-commerce grid look
