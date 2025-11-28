# DreamWeave - WebAR Career Simulation Platform

## Overview

DreamWeave is an AI-powered career guidance platform that helps students discover their ideal career path through interactive quizzes, personalized career matching, and immersive WebAR workplace previews. The platform combines a React frontend with an Express backend to deliver career recommendations based on personality, skills, and interests.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript using Vite as the build tool
- Client-side routing via Wouter for lightweight navigation
- Component library based on shadcn/ui (Radix UI primitives with Tailwind CSS)

**State Management**
- TanStack Query (React Query) for server state management and API data fetching
- Session storage for temporary quiz state and career results
- Context API for authentication state (AuthContext)

**Styling Approach**
- Tailwind CSS with custom design tokens following the "New York" style variant
- CSS variables for theming with light/dark mode support
- Design system inspired by Linear and Notion (per design_guidelines.md)
- Inter font from Google Fonts for typography

**Key User Flows**
1. Landing page → Quiz (6 questions) → Results → AR Preview
2. Optional PDF download of career report
3. Firebase authentication (Google or anonymous sign-in)

### Backend Architecture

**Server Framework**
- Node.js with Express in ESM module format
- Separate entry points for development (Vite middleware) and production (static file serving)
- Session-based request logging with duration tracking

**API Endpoints**
- `POST /api/match` - Accepts quiz answers, returns top 3 career matches with scores
- `POST /api/save-assessment` - Persists assessment results linked to user
- Career matching uses rule-based scoring algorithm (not ML-based currently)

**Development vs Production**
- Development: Vite dev server with HMR and middleware integration
- Production: Pre-built static assets served from `dist/public`
- Build pipeline: Vite builds client, esbuild bundles server

### Data Storage

**Database Schema (Drizzle ORM with PostgreSQL)**
- `users` table: Firebase UID mapping, profile information
- `assessments` table: Quiz answers (JSONB), matched career, scores, user references
- Uses Neon serverless PostgreSQL driver
- Schema defined in `shared/schema.ts` with Zod validation

**In-Memory Fallback**
- MemStorage class implements IStorage interface for development/testing
- Maps for users and assessments when database isn't available

**Data Flow**
- Quiz answers stored in session storage during quiz
- Results fetched via `/api/match` (client-side calculation)
- Optionally persisted to database via `/api/save-assessment`

### Authentication & Authorization

**Firebase Authentication**
- Client SDK integration for Google OAuth and anonymous sign-in
- AuthContext provides user state and auth methods throughout app
- Firebase UID stored in database to link users and assessments
- Environment variables for Firebase project configuration

**Security Considerations**
- `.env.example` pattern for secrets (not committed to repo)
- Credentials included in requests via `credentials: "include"`
- Firebase service account keys should be added to deployment secrets

### External Dependencies

**Third-Party Services**
- **Firebase**: Authentication (Google provider, anonymous auth)
- **Neon Database**: Serverless PostgreSQL hosting
- **Google Fonts**: Inter font family CDN

**WebAR Integration**
- Google Model Viewer web component for 3D model rendering
- Loaded via CDN (`https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0`)
- GLB models stored in `public/models/` directory
- AR preview accessible on mobile devices with AR support

**PDF Generation**
- jsPDF library for client-side PDF report generation
- Generates personalized career reports with match scores and insights
- Downloaded directly in browser without server-side processing

**UI Component Library**
- shadcn/ui components built on Radix UI primitives
- Extensive component set: dialogs, dropdowns, forms, navigation, etc.
- Accessible, keyboard-navigable components

### Career Matching Algorithm

**Current Implementation**
- Rule-based scoring system (not ML-based)
- Career data hardcoded in `server/routes.ts` and `client/src/lib/careerData.ts`
- Quiz answers weighted by category (personality, skills, interests)
- Returns top 3 careers with match scores and detailed breakdowns

**Career Data Structure**
- 50+ careers across technology, design, analytics, healthcare, business
- Each career includes: salary range, growth potential, stress index, required skills, personality traits
- Industry trends and mismatch probability metrics

### Build & Deployment Strategy

**Build Scripts**
- `npm run dev` - Development mode with Vite HMR
- `npm run build` - Production build (client via Vite, server via esbuild)
- `npm start` - Production server
- `npm run db:push` - Push Drizzle schema changes to database

**Deployment Requirements**
- Node.js environment with PostgreSQL database
- Environment variables: DATABASE_URL, Firebase config (API key, project ID, app ID)
- Static assets served from `dist/public` in production
- Supports Vercel serverless deployment pattern (separate dev/prod entry points)

**Asset Management**
- 3D models in `attached_assets/` or `public/models/`
- Generated images for landing page stored in `attached_assets/generated_images/`
- Vite alias `@assets` for easy asset imports