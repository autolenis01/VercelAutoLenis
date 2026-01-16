# AutoLenis - Automotive Marketplace Platform

AutoLenis is a comprehensive automotive marketplace connecting buyers, dealers, and affiliates for seamless vehicle transactions.

## Features

- **Buyer Portal**: Browse inventory, place offers, manage deals, and complete purchases
- **Dealer Dashboard**: Manage inventory, participate in auctions, track sales
- **Admin Panel**: Comprehensive management of users, transactions, and platform operations
- **Affiliate Program**: Multi-tier referral system with commission tracking
- **Auction System**: Real-time bidding and best price guarantees
- **Contract Management**: Digital signatures, insurance, and financing integration
- **Trade-In System**: Vehicle trade-in valuation and processing
- **Pickup Scheduling**: Appointment management with QR code check-ins

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Database**: PostgreSQL (Supabase)
- **Authentication**: Custom JWT + Supabase Auth
- **Payments**: Stripe
- **Email**: SendGrid / Resend
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI + shadcn/ui
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts

## Getting Started

### Prerequisites

- Node.js 18+ or Bun 1.0+
- PostgreSQL database (Supabase recommended)
- Stripe account
- Email service (SendGrid or Resend)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd autolenis
   ```

2. **Install dependencies**
   ```bash
   bun install
   # or
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in all required environment variables (see `.env.example` for details)

4. **Set up the database**
   ```bash
   # Generate Prisma client
   bun run postinstall
   
   # Run database migrations
   bun run db:migrate
   ```

5. **Run the development server**
   ```bash
   bun run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

### Database Setup

The project uses PostgreSQL with Supabase. Follow these steps:

1. **Create Supabase Project**

<!-- Trigger Vercel rebuild -->
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Copy connection strings to `.env`

2. **Run Migrations**
   ```bash
   # Initialize database schema
   bun run scripts/01-initialize-database.sql
   
   # Apply RLS policies (see docs/RLS_SETUP.md)
   bun run db:migrate
   ```

3. **Verify Setup**
   - Check tables in Supabase Dashboard > Database
   - Verify RLS policies are enabled

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── admin/             # Admin dashboard
│   ├── buyer/             # Buyer portal
│   ├── dealer/            # Dealer dashboard
│   └── affiliate/         # Affiliate portal
├── components/            # React components
│   ├── ui/               # Base UI components (shadcn)
│   └── layout/           # Layout components
├── lib/                   # Utility functions and services
│   ├── services/         # Business logic services
│   ├── middleware/       # API middleware
│   ├── validators/       # Zod schemas
│   └── utils/            # Helper functions
├── scripts/              # Database scripts
│   └── migrations/       # Migration scripts
├── docs/                 # Documentation
└── prisma/               # Prisma schema
```

## Available Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run start` - Start production server
- `bun run typecheck` - Type check without building
- `bun run analyze` - Analyze bundle size
- `bun run db:setup` - Initialize database
- `bun run db:push` - Push Prisma schema to database
- `bun run db:studio` - Open Prisma Studio
- `bun run db:migrate` - Run database migrations

## Authentication

The platform supports multiple user roles:

- **BUYER**: Individual customers purchasing vehicles
- **DEALER**: Authorized dealerships selling inventory
- **AFFILIATE**: Marketing partners earning commissions
- **ADMIN**: Platform administrators
- **SUPER_ADMIN**: Full system access

### Creating Admin Account

1. Set environment variables:
   ```bash
   SUPER_ADMIN_EMAIL=admin@autolenis.com
   SUPER_ADMIN_TEMP_PASSWORD=your-secure-password
   ADMIN_REGISTRATION_CODE=your-secret-code
   ```

2. Use the admin signup endpoint with the registration code

## Security

- Row Level Security (RLS) enabled on all tables
- JWT-based authentication with secure session management
- Rate limiting on sensitive endpoints
- CORS configured for API routes
- Input validation with Zod schemas
- Password hashing with bcrypt
- CSRF protection
- Secure cookie handling

See `docs/API.md` for security best practices.

## API Documentation

API endpoints are documented in `docs/API.md`. Key features:

- RESTful API design
- Consistent error responses
- Rate limiting
- Request validation
- Role-based access control

## Performance

- Server-side rendering (SSR) for dynamic content
- Static generation for landing pages
- Optimized images with Next.js Image
- Code splitting and lazy loading
- Database query optimization
- In-memory caching for frequent queries
- Bundle size monitoring

Run `bun run analyze` to see bundle composition.

## Development Guidelines

### Code Style

- TypeScript strict mode enabled
- Consistent naming conventions (see `docs/NAMING_CONVENTIONS.md`)
- Prefer functional components
- Use custom hooks for logic reuse
- Keep components small and focused

### Git Workflow

1. Create feature branch from `main`
2. Make changes with descriptive commits
3. Ensure type checking passes
4. Submit pull request for review

### Testing

```bash
# Run type checking
bun run typecheck

# Run unit tests (coming soon)
bun run test:unit

# Run E2E tests (coming soon)
bun run test:e2e
```

## Environment Variables

All required environment variables are documented in `.env.example`. Critical variables:

- Database connection (Supabase)
- Authentication secrets (JWT)
- Payment integration (Stripe)
- Email service credentials
- Application URLs

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Manual Deployment

1. Build the project: `bun run build`
2. Start production server: `bun run start`
3. Ensure all environment variables are set
4. Configure reverse proxy (nginx, Caddy)

## Monitoring

- Health check endpoint: `/api/health`
- Vercel Analytics integrated
- Database query performance monitoring
- Error logging (configure in `lib/logger.ts`)

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## Documentation

- [API Documentation](docs/API.md)
- [RLS Setup Guide](docs/RLS_SETUP.md)
- [Performance Guide](docs/PERFORMANCE.md)
- [Naming Conventions](docs/NAMING_CONVENTIONS.md)

## Support

For issues and questions:
- Create an issue on GitHub
- Check documentation in `/docs`
- Review error logs in development

## License

Proprietary - All rights reserved

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history.
