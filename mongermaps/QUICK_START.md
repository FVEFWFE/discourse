# MongerMaps Quick Start Guide

## Prerequisites
- Node.js 18+ installed
- PostgreSQL database (local or cloud)

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
```bash
# Copy the example env file
cp .env.example .env

# Edit .env and add these minimum required values:
DATABASE_URL="your_postgres_connection_string"
NEXTAUTH_SECRET="generate_with_openssl_rand_-base64_32"
```

### 3. Set Up Database
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# (Optional) Seed with sample data
npm run db:seed
```

### 4. Start Development Server
```bash
npm run dev
```

The app will be available at http://localhost:3000

## What You Can Preview Without External Services

Even without Stripe/Mapbox tokens, you can still see:

1. **Landing Page** (http://localhost:3000)
   - Lead capture form
   - Value proposition

2. **Dashboard** (http://localhost:3000/dashboard)
   - Mock data will show if database is empty
   - Paywall modal when clicking locked features
   - Blur effects on restricted content

3. **Map Page** (http://localhost:3000/map/pattaya)
   - Will show "Map Configuration Required" placeholder
   - Filters and UI are still functional

4. **Venue Pages** (http://localhost:3000/venue/sample-id)
   - Layout and tabs
   - Paywall triggers

## Quick Database Setup (if needed)

### Option 1: Local PostgreSQL
```bash
# macOS
brew install postgresql
brew services start postgresql
createdb mongermaps

# Ubuntu/Debian
sudo apt install postgresql
sudo -u postgres createdb mongermaps
```

### Option 2: Free Cloud Database
1. Go to https://supabase.com or https://neon.tech
2. Create free project
3. Copy connection string to .env

## Creating Test Data

Once database is connected:

```bash
# This will create sample venues and reports
npm run db:seed
```

## Troubleshooting

### "Cannot find module" errors
```bash
npm install
npm run db:generate
```

### Database connection errors
- Check DATABASE_URL format: `postgresql://user:password@host:port/dbname`
- Ensure PostgreSQL is running
- Try connecting with psql to verify credentials

### Build errors
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run dev
```

## Preview Without Setup

To quickly see the UI without any setup, you can:

1. Comment out the tRPC calls in dashboard/page.tsx
2. The UI will render with the mock data already in the components
3. Paywall modal will still work for demonstration

## Next Steps

Once you can see the app running:

1. **Get Mapbox Token** (free tier available)
   - Sign up at https://mapbox.com
   - Add token to .env

2. **Set Up Stripe** (test mode)
   - Create account at https://stripe.com
   - Use test keys for development

3. **Import Real Data**
   - Run your scraper
   - Import ISG posts
   - See real metrics in dashboard

The app is designed to degrade gracefully - it will work without external services, just with limited functionality.