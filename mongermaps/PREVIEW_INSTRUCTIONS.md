# 🚀 Quick Preview Instructions

You can preview the MongerMaps frontend in just 2 minutes without setting up databases or external services!

## Fastest Way to Preview (No Database Required)

### 1. Install Dependencies
```bash
cd /workspace/mongermaps
npm install
```

### 2. Create Minimal Environment File
```bash
# Create a .env file with just these two lines:
echo 'DATABASE_URL="postgresql://fake:fake@localhost:5432/fake"' > .env
echo 'NEXTAUTH_SECRET="preview-secret-not-for-production"' >> .env
```

### 3. Generate Prisma Client
```bash
npm run db:generate
```

### 4. Start the Dev Server
```bash
npm run dev
```

### 5. Open Your Browser
Navigate to: **http://localhost:3000**

## What You'll See

### Without Database Connection:
- ✅ **Landing Page**: Full lead capture experience
- ✅ **Dashboard** (`/dashboard`): UI with mock data showing blur effects and paywall
- ✅ **Map** (`/map/pattaya`): Filter UI and layout (map shows placeholder)
- ✅ **Venue Pages** (`/venue/123`): Full layout with paywall triggers
- ✅ **Paywall Modal**: Email capture and upgrade flow
- ✅ **All UI Components**: Dark theme, responsive design, animations

### Error Handling:
- The tRPC calls will fail gracefully
- You'll see the UI with sample data
- Paywall interactions still work
- Perfect for previewing the user experience

## Preview Different User States

### 1. Free User Experience (Default)
- Blurred venue names
- Locked features
- Paywall triggers everywhere

### 2. Paid User Experience
To preview as a paid user, temporarily modify `/src/app/dashboard/page.tsx`:
```typescript
// Change line ~29:
const isPaid = true; // session?.user?.isPaid;
```

## Common Issues & Solutions

### "Module not found" errors
```bash
rm -rf node_modules .next
npm install
npm run db:generate
```

### Port 3000 already in use
```bash
# Use a different port
PORT=3001 npm run dev
```

### Build errors with btcpay
The btcpay package has issues. You can:
1. Remove it from package.json
2. Run `npm install` again
3. Or just ignore the warning - it won't affect the preview

## What's Mocked for Preview

1. **Dashboard Metrics**: Shows sample vibe scores and prices
2. **Intel Feed**: 5 sample field reports with venue names
3. **Top Venues**: 3 sample venues for watchlist
4. **Map Venues**: Would show real venues with database connection
5. **Stripe Checkout**: Shows flow but won't process payments

## Next Steps After Preview

Once you've seen the UI and want to make it fully functional:

1. **Set up PostgreSQL** (local or Supabase free tier)
2. **Run database migrations**: `npm run db:push`
3. **Seed sample data**: `npm run db:seed`
4. **Add Mapbox token** for interactive map
5. **Add Stripe keys** for real payments

The app is designed to work at every stage - you can preview the UX immediately and add services as needed!

## 🎯 Quick Links After Starting

- Landing: http://localhost:3000
- Dashboard: http://localhost:3000/dashboard
- Map: http://localhost:3000/map/pattaya
- Sample Venue: http://localhost:3000/venue/sample-venue
- Sign In: http://localhost:3000/auth/signin

Enjoy exploring MongerMaps! The frontend is fully built and ready for your data.