# CinePulse — MVVM React Movie Explorer & Watchlist

> Built with React 19, TypeScript, Tailwind CSS v4, OMDB API, and Firebase Authentication & Realtime Database.

## Features
- **MVVM Architecture**: Clean separation between Models, Services, ViewModels (custom hooks), and Views (presentation components).
- **Hero Spotlight & Curated Carousels**: Featured spotlight film with trailers, ratings, and curated cinema categories.
- **OMDB API Integration**: Fast search with 350ms debouncing, content type filtering (Movies, Series), year filter, sorting, and pagination.
- **Full Movie Details Modal**: Rotten Tomatoes, IMDb, Metacritic scores, plot synopsis, director, cast, box office, awards, and direct YouTube trailer search.
- **Firebase Realtime Database & Auth**: Cloud-synced user Watchlist with real-time listener updates, plus 1-Click Guest access for instant evaluation.
- **Protected Routes**: `/favorites` guarded by authentication status.
- **Resilient Fallback**: Zero-crash design with built-in mock data and local storage simulation if API keys or internet are unavailable.

## Project Structure
```
cinepulse-movie-app/
├── src/
│   ├── models/            # Domain models & TypeScript interfaces
│   ├── services/          # API, Firebase & Local Storage services
│   ├── viewmodels/        # Custom ViewModel hooks (business logic)
│   ├── components/        # Reusable UI components (View layer)
│   ├── context/           # AuthContext
│   ├── pages/             # Route pages (Home, Explore, Favorites, 404)
│   ├── App.tsx            # Code-split router & application layout
│   └── main.tsx           # Entry point
├── SUBMISSION.md          # Formal Internship Submission Report
└── README.md
```

## Quick Start
```bash
# 1. Navigate to project
cd C:\Users\DELL\cinepulse-movie-app

# 2. Install dependencies (if not already installed)
npm install

# 3. Start development server
npm run dev

# 4. Open in browser
# http://localhost:5173
```

## Production Build
```bash
npm run build
npm run preview
```

## Submission Documentation
See [SUBMISSION.md](./SUBMISSION.md) for full details on prompts used, AI assistance methodology, and manual improvements/refactorings.
