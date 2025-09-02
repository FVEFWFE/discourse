# Connect GitHub to Railway Discourse

## Option 1: Use Railway's Git Integration (Easier)

1. In Railway dashboard, go to your Discourse service
2. Click "Settings" → "Source"
3. Click "Connect GitHub repo"
4. Select your forked Discourse repo
5. Set branch to `main`

Now Railway will auto-deploy when you push to GitHub!

## Option 2: Manual Theme/Plugin Updates

Since Railway template uses pre-built Discourse, the easiest way to customize is through the admin panel:

### Install Theme from GitHub:
1. Go to Admin → Customize → Themes
2. Click "Install" → "From a git repository"
3. Enter: `https://github.com/YOUR-USERNAME/discourse-unreal-theme`
4. Click "Install"

### For Plugins:
1. You'll need to modify the Railway deployment
2. Or use plugin URLs in the admin panel

## Option 3: Custom Railway Deployment

Replace Railway's template with your own:

```javascript
// In Railway dashboard
// Settings → Environment → Add these variables:

DISCOURSE_DEVELOPER_EMAILS=your@email.com
DISCOURSE_HOSTNAME=your-discourse.railway.app
DISCOURSE_SMTP_ADDRESS=smtp.sendgrid.net
DISCOURSE_SMTP_PORT=587
DISCOURSE_SMTP_USER_NAME=apikey
DISCOURSE_SMTP_PASSWORD=your-sendgrid-api-key
```