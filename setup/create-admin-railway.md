# Creating Admin Account on Railway Discourse

## Option 1: Use Railway CLI (Easiest)

1. Install Railway CLI:
```bash
npm install -g @railway/cli
```

2. Login to Railway:
```bash
railway login
```

3. Link to your project:
```bash
railway link
```

4. Create admin account:
```bash
railway run rake admin:create

# It will prompt:
# Email: your@email.com
# Password: [your-password]
# Repeat password: [your-password]
# Do you want to grant Admin privileges? (Y/n): Y
```

## Option 2: Through Railway Dashboard

1. Go to your Discourse service in Railway
2. Click on "Settings" tab
3. Find "Connect" section
4. Click "Connect" to open a shell

5. Run this command:
```bash
cd /var/www/discourse
RAILS_ENV=production bundle exec rake admin:create
```

6. Follow the prompts to create admin

## Option 3: If Sign-up Page Shows "Sorry, new registrations are not allowed"

1. In Railway dashboard, add this environment variable:
```
DISCOURSE_ALLOW_REGISTRATION=true
```

2. Redeploy the service

3. Sign up with your email

4. To make yourself admin after signup, use Railway shell:
```bash
cd /var/www/discourse
RAILS_ENV=production rails c
u = User.find_by_email("your@email.com")
u.admin = true
u.save!
exit
```

## Common Issues

### "Must verify email" but no email received
- Email isn't configured yet
- Use Method 2 (Railway CLI) instead

### "New registrations are not allowed"
- Add DISCOURSE_ALLOW_REGISTRATION=true to Railway environment variables

### Can't connect to Railway shell
- Make sure you're logged into Railway
- Check that your deployment is running (green status)