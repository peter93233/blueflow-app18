# Replit.md - Express React Budget Tracker

## Overview

This is a full-stack web application for budget tracking and financial management called BlueFlow. The project is built with a React frontend using TypeScript and Vite, an Express.js backend with TypeScript, and uses Drizzle ORM for database management with PostgreSQL. The application features a modern UI built with shadcn/ui components, Tailwind CSS, and Framer Motion animations with iOS-inspired neumorphism design and glass morphism effects.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Component Library**: shadcn/ui components built on Radix UI primitives
- **Animations**: Framer Motion for smooth UI animations
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Database**: Neon Database (serverless PostgreSQL)
- **Session Management**: PostgreSQL session store with connect-pg-simple
- **API Structure**: RESTful API with /api prefix routing
- **Development**: Hot module replacement with Vite middleware integration

### Database Schema
- **Users Table**: Supports both traditional authentication (name, email, password) and OAuth (firstName, lastName, profileImageUrl)
- **Sessions Table**: Secure session storage for authentication state management
- **Expenses Table**: User expenses with name, amount, category, date, and timestamps
- **Budgets Table**: User budget settings with amount, period (weekly/biweekly/monthly)
- **User Balances Table**: Current account balance for each user
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Migration System**: Drizzle Kit for schema migrations
- **Relations**: Proper foreign key relationships between users and their financial data

## Key Components

### Frontend Components
1. **UI Components**: Complete shadcn/ui component library including buttons, cards, forms, navigation, etc.
2. **Budget Components**: 
   - BalanceCard: Displays current balance with update functionality
   - BudgetCard: Shows weekly budget progress with visual indicators and links to Add Expense
   - QuickActions: Provides shortcuts to analytics and goals
   - BottomNavigation: Mobile-friendly navigation bar with routing to different screens
   - FloatingAIButton: AI assistant integration placeholder with smooth animations
3. **Layout**: Mobile-first responsive design optimized for smartphone usage
4. **Theming**: Custom BlueFlow color palette with neumorphism effects and glass morphism buttons
5. **Pages**: 
   - Home: Main dashboard with balance, budget tracker, and quick actions
   - Add Expense: Form to add new expenses with category selection
   - Budget Settings: Configure weekly/biweekly/monthly budget limits
   - Reports: Visual placeholder for spending analytics and charts

### Backend Components
1. **Database Integration**: PostgreSQL database with Drizzle ORM for expenses, budgets, user balances, and authentication
2. **Authentication System**: Complete JWT-based authentication with bcrypt password hashing
3. **Storage Interface**: Database storage implementation with comprehensive CRUD operations for users and financial data
4. **API Routes**: RESTful endpoints for authentication, expenses, budgets, and user balances with Zod validation
5. **Route Registration**: Centralized route management system with authentication middleware
6. **Error Handling**: Global error middleware for consistent error responses
7. **Development Integration**: Vite middleware for seamless development experience

### Authentication & Authorization
- **Simple Email/Password Authentication**: Complete registration and login system with secure password hashing
- **JWT Token Authentication**: 7-day token expiration with automatic refresh capability
- **Dual Authentication Support**: Both traditional email/password and OAuth (Replit) authentication methods
- **Security Features**: bcrypt password hashing, input validation, protected API routes
- **User Experience**: Beautiful glassmorphism login/registration forms with real-time validation
- **Session Management**: Secure token storage and automatic authentication state management

## Data Flow

1. **Client Requests**: React components make API calls using TanStack Query
2. **API Layer**: Express routes handle HTTP requests with /api prefix
3. **Storage Layer**: Abstracted storage interface allows switching between in-memory and database implementations
4. **Database**: Drizzle ORM manages PostgreSQL interactions with type safety
5. **Response**: JSON responses with consistent error handling

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL database connection
- **drizzle-orm**: Type-safe ORM for database operations
- **@tanstack/react-query**: Server state management
- **framer-motion**: Animation library
- **wouter**: Lightweight router
- **zod**: Schema validation

### UI Dependencies
- **@radix-ui**: Primitive UI components for accessibility
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Type-safe variant creation
- **cmdk**: Command palette component

### Development Dependencies
- **vite**: Build tool and development server
- **typescript**: Type checking and compilation
- **tsx**: TypeScript execution for development

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite builds React app to `dist/public`
2. **Backend Build**: esbuild compiles TypeScript server to `dist/index.js`
3. **Database**: Drizzle migrations applied via `db:push` command

### Environment Setup
- **DATABASE_URL**: Required environment variable for PostgreSQL connection
- **NODE_ENV**: Controls development vs production behavior
- **Replit Integration**: Special handling for Replit development environment

### Development Workflow
- **Local Development**: `npm run dev` starts development server with hot reload
- **Type Checking**: `npm run check` validates TypeScript compilation
- **Database Management**: `npm run db:push` applies schema changes
- **Production**: `npm run build && npm start` for production deployment

### Production Considerations
- Static file serving for built React application
- Environment-based configuration
- Database connection pooling via Neon's serverless architecture
- Error logging and monitoring ready for implementation