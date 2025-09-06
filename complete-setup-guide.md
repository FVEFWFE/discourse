# Complete Discourse Setup Guide for Large vBulletin Migration

## 1. Infrastructure Requirements (2M Posts)

### Minimum Server Specs:
- **CPU**: 4-8 cores
- **RAM**: 16-32GB 
- **Storage**: 200GB+ SSD
- **Database**: Separate PostgreSQL server recommended

### Recommended Providers:
- **Hetzner**: Best value (€39/month for suitable server)
- **DigitalOcean**: $160/month for 16GB droplet
- **AWS/GCP**: More complex but scalable

## 2. Email Setup (MailerLite/MailerSend)

### Configure SMTP:
```bash
DISCOURSE_SMTP_ADDRESS=smtp.mailersend.net
DISCOURSE_SMTP_PORT=587
DISCOURSE_SMTP_USER_NAME=[Get from MailerSend]
DISCOURSE_SMTP_PASSWORD=[Get from MailerSend]
DISCOURSE_SMTP_ENABLE_START_TLS=true
DISCOURSE_NOTIFICATION_EMAIL=noreply@yourdomain.com
DISCOURSE_DEVELOPER_EMAILS=your@email.com
```

## 3. vBulletin Migration Process

### Pre-Migration:
1. **Backup Everything**
   - Full vBulletin database dump
   - All attachments/uploads
   - User avatars

2. **Test Migration First**
   - Set up staging server
   - Run import on sample data
   - Verify data integrity

### Migration Steps:
```bash
# 1. Install import dependencies
cd /var/discourse
./launcher enter app
gem install mysql2 php_serialize

# 2. Configure import script
cd script/import_scripts
cp vbulletin.rb vbulletin_custom.rb
# Edit database connection settings

# 3. Run import (will take 12-48 hours for 2M posts)
RAILS_ENV=production bundle exec ruby vbulletin_custom.rb
```

### Post-Migration:
1. Rebuild search index
2. Update user permissions
3. Set up redirects from old URLs
4. Verify attachment imports

## 4. Performance Optimization

### PostgreSQL Tuning:
```sql
-- For 16GB RAM server
shared_buffers = 4GB
work_mem = 32MB
maintenance_work_mem = 1GB
effective_cache_size = 12GB
```

### Redis Configuration:
```
maxmemory 2gb
maxmemory-policy allkeys-lru
```

### Discourse Settings:
- Enable CDN for assets
- Configure S3 for uploads
- Enable read-only mode during migration

## 5. Theme Customization (Unreal Engine Style)

### Install Theme:
1. Admin → Customize → Themes
2. Install from repository
3. Apply Unreal Engine color scheme

### Custom CSS:
- Dark background (#0f0f0f)
- Blue accents (#0090ff)
- Custom fonts (Inter)

## 6. Essential Plugins

### For Large Forums:
- discourse-solved
- discourse-voting  
- discourse-data-explorer
- discourse-backup-uploads-to-s3

## 7. Backup Strategy

### Daily Backups:
- Database: pg_dump with compression
- Uploads: S3 sync
- Settings: Git repository

### Disaster Recovery:
- Separate backup server
- Off-site storage
- Tested restore procedure

## 8. Migration Timeline

### Week 1:
- Server setup
- Discourse installation
- Email configuration
- Test import with sample data

### Week 2:
- Full database import (2-3 days)
- Attachment migration
- Search index rebuild
- Performance tuning

### Week 3:
- Theme customization
- Plugin installation
- User acceptance testing
- DNS cutover

## 9. Cost Estimate

### Monthly Costs:
- Server: $150-300/month
- CDN: $20-50/month
- Email: $20/month (MailerSend)
- Backups: $10-20/month
- **Total**: ~$200-400/month

## 10. Critical Warnings

### ⚠️ Do NOT:
- Run import on production without testing
- Use Railway/Heroku for this scale
- Skip backup verification
- Import without enough disk space

### ✅ Do:
- Test everything on staging first
- Monitor import progress
- Keep vBulletin running during migration
- Plan for 2-week migration window