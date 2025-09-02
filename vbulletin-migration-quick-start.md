# Quick Start: vBulletin to Discourse Migration

## Step 1: Get Proper Hosting
Forget Railway. You need either:
- **Hetzner Cloud**: CCX31 (€49/month) - BEST VALUE
- **DigitalOcean**: 16GB Droplet ($160/month)
- **Managed Discourse**: $300/month (they handle migration)

## Step 2: vBulletin Export Prep
```sql
-- Check your post count
SELECT COUNT(*) FROM post;
SELECT COUNT(*) FROM thread;
SELECT COUNT(*) FROM user;

-- Export database
mysqldump -u root -p vbulletin_db > vbulletin_backup.sql
```

## Step 3: Import Script Location
Check: `/var/discourse/script/import_scripts/vbulletin.rb`

## Step 4: Migration Reality Check
- 2M posts = 24-48 hour import time
- Needs 100GB+ free disk space
- Will stress server heavily
- Must test on smaller dataset first

## Alternative: Phased Migration
Instead of importing all 2M posts:
1. Import last 2 years only
2. Archive old content separately
3. Import most popular threads
4. Keep vBulletin as read-only archive

Would this work better for you?