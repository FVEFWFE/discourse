# Email Setup for Railway Discourse

## Free Email Providers for Discourse

### 1. Brevo (Recommended - 300 emails/day free)
1. Sign up at https://www.brevo.com
2. Get SMTP credentials:
   - SMTP Server: smtp-relay.brevo.com
   - Port: 587
   - Username: Your Brevo email
   - Password: Your SMTP key

### 2. SendGrid (100 emails/day free)
1. Sign up at https://sendgrid.com
2. Create API key
3. SMTP settings:
   - SMTP Server: smtp.sendgrid.net
   - Port: 587
   - Username: apikey
   - Password: Your API key

### 3. Mailgun (First month free)
1. Sign up at https://www.mailgun.com
2. Verify domain
3. Get SMTP credentials

## Add to Railway:
1. Go to your Discourse service in Railway
2. Click "Variables"
3. Add:
   ```
   DISCOURSE_SMTP_ADDRESS=smtp-relay.brevo.com
   DISCOURSE_SMTP_PORT=587
   DISCOURSE_SMTP_USER_NAME=your@email.com
   DISCOURSE_SMTP_PASSWORD=your-smtp-key
   DISCOURSE_SMTP_ENABLE_START_TLS=true
   ```
4. Redeploy