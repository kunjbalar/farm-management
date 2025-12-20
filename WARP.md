# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Running the Application

```bash
# Install dependencies
npm install

# Run development server (starts both frontend and backend)
# On Unix/Mac/Linux:
npm run dev

# On Windows PowerShell:
$env:NODE_ENV='development'; npx tsx server/index.ts

# Application runs at http://localhost:5000

# Production build
npm run build

# Run production server
npm start
```

### Database Operations

```bash
# Push database schema to PostgreSQL (creates/updates tables)
npm run db:push

# This creates three tables: users, orders, inventory
```

### Type Checking

```bash
# Run TypeScript type checker (no emit)
npm run check
```

### PowerShell-Specific Notes

Since the package.json scripts use Unix-style environment variable syntax (`NODE_ENV=development`), you may need to adjust for Windows PowerShell:

```powershell
# Development mode in PowerShell
$env:NODE_ENV="development"; tsx server/index.ts

# Or use cross-env if added as a dependency
```

## Project Architecture

### Stack Overview

- **Frontend**: React 18 + Vite + TypeScript
- **Backend**: Express.js + TypeScript (ESM modules)
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack React Query for server state
- **Routing**: Wouter (lightweight client-side routing)

### Directory Structure

```
farm-management/
├── client/               # Frontend application
│   ├── src/
│   │   ├── components/  # React components (widgets, cards, pages)
│   │   ├── pages/       # Route-level page components
│   │   ├── lib/         # Query client and utilities
│   │   ├── hooks/       # Custom React hooks
│   │   ├── App.tsx      # Root component with auth logic
│   │   └── main.tsx     # Application entry point
│   └── index.html       # HTML template
├── server/              # Backend application
│   ├── index.ts         # Express server setup
│   ├── routes.ts        # API route handlers
│   ├── storage.ts       # Database storage interface and implementation
│   ├── db.ts            # Drizzle database connection
│   └── vite.ts          # Vite middleware for dev mode
├── shared/              # Shared code between frontend and backend
│   └── schema.ts        # Database schema and Zod validation schemas
└── migrations/          # Database migration files (generated)
```

### Authentication Flow

**Important**: The authentication system uses a simple session-based approach that needs attention before production:

1. **Session Storage**: In-memory Map on server (`sessions` in `routes.ts`)
2. **Client Storage**: sessionId stored in localStorage
3. **API Authentication**: Bearer token in Authorization header
4. **Security Issues**:
   - Passwords stored in plain text (not hashed)
   - Session tokens are not cryptographically secure
   - Sessions lost on server restart (in-memory only)

**For production deployment**: Implement proper password hashing (bcrypt), secure session tokens, and persistent session storage (e.g., Redis or PostgreSQL with `connect-pg-simple`).

### Database Schema

Three main tables defined in `shared/schema.ts`:

**users**: Stores farmer profiles and credentials
- id (uuid), email (unique), password, name, farmName, farmLocation, contact, totalArea

**orders**: Tracks agricultural product orders
- id (serial), orderId (unique string), orderDetails (text), orderDate (timestamp), userId (foreign key)

**inventory**: Manages inventory items
- id (serial), name, quantity, status, userId (foreign key)

### API Request Pattern

All authenticated API requests follow this pattern:

```typescript
// Authorization header is automatically added by queryClient
const sessionId = localStorage.getItem("sessionId");
headers["Authorization"] = `Bearer ${sessionId}`;
```

This is configured in `client/src/lib/queryClient.ts` for both `apiRequest` and `getQueryFn` functions.

### Key API Endpoints

```
POST   /api/register        # Create new user account
POST   /api/login           # Authenticate user
POST   /api/logout          # Clear session
GET    /api/user            # Get current user profile
PUT    /api/user            # Update user profile
POST   /api/orders          # Create new order (also adds to inventory)
GET    /api/orders          # Get user's orders
GET    /api/inventory       # Get user's inventory items
```

### Component Architecture

**Dashboard Structure**:
- Main layout: Sidebar (farmer profile + navigation) + Content area
- Three main dashboard tabs: Overview, Management, Analytics
- Widget-based design with reusable card components

**Key Component Categories**:
1. **Widgets** (Overview page): WeatherWidget, SoilHealthWidget, CropStatusWidget, MachineryWidget, AlertsWidget, InventoryWidget
2. **Management Cards**: CropManagementCard, EquipmentMaintenanceCard, IrrigationScheduleCard, HarvestCountdownCard
3. **Analytics**: Chart components using Recharts
4. **Pages**: DashboardPage, OrderHistoryPage, LoginPage

### State Management Pattern

**Server State** (via React Query):
```typescript
// Queries for data fetching
const { data } = useQuery({
  queryKey: ['/api/endpoint'],
  // queryFn automatically configured with auth headers
});

// Mutations for data updates
const mutation = useMutation({
  mutationFn: async (data) => {
    const res = await apiRequest('POST', '/api/endpoint', data);
    return res.json();
  },
});
```

**Local State** (via React hooks):
- User authentication state in `App.tsx`
- localStorage for session persistence

### Design System

**Theme**: Agricultural-focused with primary green color (HSL: 142 71% 45%)

**Typography**: Inter font family from Google Fonts

**Component Library**: shadcn/ui "new-york" style with Radix UI primitives

**Styling Approach**:
- Tailwind CSS utility classes
- CSS custom properties for theming
- Dark mode support throughout

Detailed design guidelines are documented in `design_guidelines.md`.

### Path Aliases

TypeScript path aliases are configured in `tsconfig.json`:

```typescript
import { Button } from "@/components/ui/button";        // Client components
import { users } from "@shared/schema";                  // Shared schema
import someAsset from "@assets/file.txt";               // Attached assets
```

## Local Database Setup

The application requires PostgreSQL. For detailed local setup instructions, see `LOCAL_DATABASE_SETUP.md`.

**Quick Setup**:
1. Install PostgreSQL locally
2. Create database: `CREATE DATABASE farm_management;`
3. Set environment variable: `DATABASE_URL=postgresql://postgres:password@localhost:5432/farm_management`
4. Push schema: `npm run db:push`
5. Run app: `npm run dev`

**Connection String Format**:
```
postgresql://[username]:[password]@[host]:[port]/[database]
```

## Important Implementation Notes

### Order Submission Bug Fix

A critical bug was fixed where order submissions were failing. The solution involved adding the Authorization header with sessionId in `client/src/lib/queryClient.ts` for all authenticated requests.

**POST /api/orders behavior**:
- Creates order record in `orders` table
- If request includes `name` and `status` fields, also creates `inventory` entry
- Returns created order with generated orderId (format: `ORD-{timestamp}-{random}`)

### Development Mode

The server runs Vite in middleware mode during development:
- HMR (Hot Module Replacement) enabled
- Frontend served through Express
- Both frontend and backend run on same port (5000)

### Production Build

Two-step build process:
1. **Frontend**: Vite builds React app → `dist/public/`
2. **Backend**: esbuild bundles server code → `dist/index.js`

The production server serves static files from `dist/public` and API routes.

## Working with This Codebase

### Adding New API Endpoints

1. Define schema in `shared/schema.ts` (if needed)
2. Add storage method in `server/storage.ts` (implements IStorage interface)
3. Create route handler in `server/routes.ts`
4. Add session validation using `sessions.get(sessionId)`

### Adding New Components

1. Create component in `client/src/components/`
2. Use shadcn/ui primitives from `@/components/ui/`
3. Follow agricultural theme colors and design patterns
4. Import in parent component or page

### Database Schema Changes

1. Modify schema in `shared/schema.ts`
2. Run `npm run db:push` to update database
3. Update TypeScript types (auto-inferred by Drizzle)
4. Update storage interface in `server/storage.ts` if needed

### Environment Variables

Required:
- `DATABASE_URL`: PostgreSQL connection string

Optional:
- `NODE_ENV`: "development" or "production"

**Security**: Never commit `.env` files. The `.gitignore` should include `.env`.
