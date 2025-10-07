# Farm Management Dashboard

## Overview

A full-stack farm management dashboard application that enables farmers to track and manage their agricultural operations. The system provides a comprehensive interface for monitoring crops, equipment, soil health, weather conditions, inventory, and irrigation schedules. Built with React and Express, the application features a clean, modern dashboard design inspired by Linear and Notion, optimized for agricultural data visualization and workflow efficiency.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- **Framework:** React with Vite for fast development and optimized builds
- **UI Components:** Radix UI primitives for accessible, headless components
- **Styling:** Tailwind CSS with custom design system using HSL color values
- **State Management:** TanStack React Query for server state management
- **Routing:** Wouter for lightweight client-side routing
- **Charts:** Recharts for data visualization

**Design System:**
- Agricultural-themed color palette with primary green (142 71% 45%) representing growth/farming
- Inter font family from Google Fonts for clean, modern typography
- Component library following shadcn/ui "new-york" style with custom agricultural adaptations
- Responsive layout system using Tailwind spacing units (2, 4, 6, 8, 12, 16, 24)
- Dark mode support with CSS custom properties

**Component Architecture:**
- Widget-based dashboard components (Weather, Soil Health, Crop Status, Machinery, Alerts, Inventory)
- Management cards (Crop Management, Equipment Maintenance, Irrigation Schedule, Harvest Countdown)
- Analytics visualization components with multiple chart types
- Reusable UI primitives from Radix UI (dialogs, popovers, dropdowns, etc.)

### Backend Architecture

**Technology Stack:**
- **Runtime:** Node.js with Express.js framework
- **Language:** TypeScript with ESM modules
- **Database ORM:** Drizzle ORM configured for PostgreSQL
- **Session Management:** In-memory session store (Map-based)
- **Development:** Vite dev server in middleware mode with HMR support

**API Design:**
- RESTful endpoints under `/api` prefix
- Session-based authentication using bearer tokens
- JSON request/response format
- Error handling middleware with status codes and messages

**Current Implementation:**
- In-memory storage implementation (MemStorage class) for development
- User registration and login endpoints
- User profile management
- Session management with localStorage persistence on client

**Data Models:**
- User model with farm-specific fields (farmName, farmLocation, totalArea, contact)
- Extensible schema design using Drizzle ORM and Zod validation
- PostgreSQL-ready schema with UUID primary keys

### Database & Data Layer

**ORM & Schema:**
- Drizzle ORM with Drizzle Kit for migrations
- PostgreSQL dialect configured via Neon serverless driver
- Schema defined in TypeScript with runtime validation using drizzle-zod
- Type-safe database operations with inferred types

**Schema Design:**
- Users table with authentication and farm profile data
- UUID-based primary keys using `gen_random_uuid()`
- Zod schemas for validation (insertUserSchema, loginSchema, registerSchema)
- Type exports for compile-time safety (User, InsertUser, LoginInput, RegisterInput)

**Storage Pattern:**
- Interface-based storage abstraction (IStorage)
- Current: In-memory implementation for rapid development
- Future-ready: Can swap to database implementation without API changes

### Authentication & Session Management

**Authentication Flow:**
- Email/password registration with uniqueness validation
- Login with credential verification
- Session ID generation using random strings
- Bearer token authentication for API requests

**Session Storage:**
- Server: In-memory Map storing sessionId -> userId mappings
- Client: localStorage persistence for user data and sessionId
- Logout: Clears both server session and client storage

**Security Considerations:**
- Passwords currently stored in plain text (development only - needs hashing in production)
- No password strength requirements implemented
- Session tokens not cryptographically secure (development only)

### Build & Deployment

**Build Process:**
- Frontend: Vite builds React app to `dist/public`
- Backend: esbuild bundles server code to `dist/index.js`
- ESM module format throughout
- TypeScript compilation with path aliases resolved

**Development Setup:**
- Vite dev server with middleware mode
- Hot module replacement for frontend
- tsx for TypeScript execution in development
- Runtime error overlay for debugging

**Environment Configuration:**
- Database URL from environment variable (DATABASE_URL)
- NODE_ENV for environment detection
- Replit-specific plugins for dev tooling (cartographer, dev-banner)

## External Dependencies

### Core Dependencies

**Frontend Libraries:**
- @tanstack/react-query: Server state management and caching
- wouter: Lightweight routing library
- date-fns: Date manipulation and formatting
- recharts: Chart rendering for analytics
- lucide-react: Icon library

**UI Component Libraries:**
- @radix-ui/* (20+ packages): Headless accessible UI primitives including dialogs, dropdowns, tooltips, tabs, accordions, popovers, and form controls
- class-variance-authority: Type-safe variant styling
- clsx & tailwind-merge: Conditional className utilities
- cmdk: Command palette component
- embla-carousel-react: Carousel functionality

**Backend Libraries:**
- express: Web framework
- @neondatabase/serverless: PostgreSQL client for Neon
- drizzle-orm: TypeScript ORM
- drizzle-zod: Zod schema generation from Drizzle schemas
- connect-pg-simple: PostgreSQL session store (unused currently)

**Form & Validation:**
- react-hook-form: Form state management
- @hookform/resolvers: Validation resolver integrations
- zod: Runtime type validation

### Development Tools

- vite: Build tool and dev server
- @vitejs/plugin-react: React plugin for Vite
- typescript: Type checking
- tsx: TypeScript execution for Node.js
- esbuild: JavaScript bundler
- drizzle-kit: Database migration tool
- tailwindcss & autoprefixer: CSS tooling

### Replit-Specific

- @replit/vite-plugin-runtime-error-modal: Error overlay
- @replit/vite-plugin-cartographer: Development tooling
- @replit/vite-plugin-dev-banner: Development banner

### External Services

**Database:**
- Neon serverless PostgreSQL (configured but not actively used - currently using in-memory storage)
- Connection via DATABASE_URL environment variable

**Fonts:**
- Google Fonts (Inter font family)
- Preconnected with crossorigin for performance