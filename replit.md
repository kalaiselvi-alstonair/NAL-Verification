# NAL India - Property Verification Platform

## Overview

NAL India is a full-stack web application that provides automated property verification services for real estate transactions in India. The platform uses AI-powered automation to verify property ownership, legal status, and document authenticity by integrating with multiple government portals across Indian states.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Routing**: Wouter for client-side routing
- **UI Components**: Radix UI with shadcn/ui component library
- **Styling**: Tailwind CSS with custom design system
- **State Management**: TanStack React Query for server state management
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Validation**: Zod for runtime type checking
- **Session Management**: Express sessions with PostgreSQL storage
- **API Design**: RESTful endpoints for contact management

### Development Setup
- **Monorepo Structure**: Shared schema and utilities between client and server
- **Hot Module Replacement**: Vite dev server with Express integration
- **TypeScript**: Strict type checking across the entire codebase
- **Path Aliases**: Organized imports with @ aliases for better maintainability

## Key Components

### Database Layer
- **Users Table**: Authentication and user management
- **Contacts Table**: Contact form submissions and lead management
- **Schema Management**: Drizzle ORM with PostgreSQL dialect
- **Migrations**: Database schema versioning and deployment

### API Layer
- **Contact Management**: POST /api/contact for form submissions
- **Data Retrieval**: GET /api/contacts for admin access
- **Error Handling**: Comprehensive error responses with proper HTTP status codes
- **Request Logging**: Detailed API request/response logging

### Frontend Features
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Navigation**: Multi-page application with sticky navigation
- **Form Validation**: Client-side validation with server-side verification
- **Toast Notifications**: User feedback for form submissions
- **Loading States**: Enhanced UX with loading indicators

### UI Components
- **Design System**: Consistent color scheme and typography
- **Reusable Components**: Feature cards, testimonials, process steps
- **Accessibility**: ARIA labels and keyboard navigation support
- **Dark Mode**: CSS variables for theme switching capability

## Data Flow

### Contact Form Submission
1. User fills out contact form on frontend
2. Form data validated using Zod schema
3. API request sent to `/api/contact` endpoint
4. Server validates data and stores in PostgreSQL
5. Success/error response sent back to client
6. Toast notification displayed to user

### Content Management
1. Static content served from React components
2. Dynamic content from external APIs (images from Unsplash)
3. Form data persisted in database
4. Admin access to view all contact submissions

## External Dependencies

### Core Libraries
- **React Ecosystem**: React, React DOM, React Hook Form
- **UI Components**: Radix UI primitives, shadcn/ui components
- **Database**: Drizzle ORM, @neondatabase/serverless
- **Validation**: Zod for schema validation
- **Styling**: Tailwind CSS, class-variance-authority
- **Routing**: Wouter for lightweight routing
- **HTTP Client**: TanStack React Query for server state

### Development Tools
- **Build Tools**: Vite, esbuild for production builds
- **TypeScript**: Full type safety across the stack
- **PostCSS**: CSS processing with Tailwind
- **ESLint**: Code quality and consistency

### External Services
- **Database**: Neon PostgreSQL (serverless)
- **Images**: Unsplash for stock photography
- **Icons**: Lucide React for consistent iconography

## Deployment Strategy

### Production Build
- **Frontend**: Vite builds static assets to `dist/public`
- **Backend**: esbuild bundles server code with external dependencies
- **Database**: Drizzle migrations applied via `db:push` command

### Environment Configuration
- **Database URL**: Required environment variable for PostgreSQL connection
- **Node Environment**: Development/production mode switching
- **Build Scripts**: Separate development and production workflows

### Development Workflow
- **Hot Reload**: Vite dev server with Express backend integration
- **Type Checking**: Continuous TypeScript compilation
- **Database**: Local development with cloud PostgreSQL

## Changelog

```
Changelog:
- July 08, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```