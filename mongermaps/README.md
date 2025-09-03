# MongerMaps MVP

The Bloomberg Terminal for Mongers - A private intelligence service providing real-time data and insider knowledge.

## Project Structure

This is a T3 Stack project with the following technologies:
- Next.js 14 (App Router)
- TypeScript
- Prisma (PostgreSQL)
- tRPC
- Tailwind CSS & shadcn/ui
- NextAuth.js
- Mapbox GL JS
- Stripe & BTCPay Server for payments

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your database URL and other required variables.

3. **Set up the database:**
   ```bash
   # Generate Prisma client
   npm run db:generate

   # Run migrations
   npm run db:migrate

   # Seed the database with sample data
   npm run db:seed
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

## Phase Implementation Status

### Phase 1: Pre-Launch & Foundation ✅
- [x] Database schema design
- [x] Prisma models for all entities
- [x] Apify scraper setup for ISG data extraction
- [x] Alpha tester registration page at `/insider`
- [x] Seed script for venues and test data

### Phase 2: Public Launch & Lead Generation ✅
- [x] Lead magnet squeeze page (homepage)
- [x] Thank you/tripwire page with Trip Pass offer
- [x] Email capture functionality
- [ ] Email automation setup (requires email service integration)
- [ ] PDF cheat sheet creation and delivery

### Phase 3: Core Product & Upsell Funnel 🚧
- [x] tRPC API setup with routers
- [x] Authentication setup with NextAuth.js
- [x] Subscription model and payment integration (Stripe)
- [ ] Interactive map with Mapbox GL JS
- [ ] Dashboard and member pages
- [ ] Venue detail pages
- [ ] Report submission system
- [ ] BTCPay Server integration for annual subscriptions
- [ ] Referral/affiliate system

## Data Pipeline

The scraper is located in the `/scraper` directory:

1. **Run the scraper:**
   ```bash
   cd scraper
   npm install
   npm start
   ```

2. **Import scraped data:**
   The seed script will automatically import data from `scraper/output/dataset.json` if it exists.

## Test Accounts

After seeding, you can use these test accounts:

- **Alpha Tester:** 
  - Username: `alphatester1`
  - Password: `testpass123`

- **Premium User:**
  - Username: `premiumuser1`
  - Password: `testpass123`
  - Has active annual subscription

## Security Notes

- All user identification is anonymous (username-based)
- HTTPS is required in production
- Sensitive data is encrypted
- No real names or personal information is stored

## Next Steps

1. Set up email service (SendGrid/Postmark)
2. Create PDF cheat sheet asset
3. Implement Mapbox interactive map
4. Build out member dashboard
5. Integrate BTCPay Server for Bitcoin payments
6. Deploy to production environment