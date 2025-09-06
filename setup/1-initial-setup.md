# Initial GitHub Setup

## 1. Fork Discourse
1. Go to https://github.com/discourse/discourse
2. Click "Fork" to your account
3. Clone your fork:
   ```bash
   git clone https://github.com/YOUR-USERNAME/discourse.git discourse-unreal-forum
   cd discourse-unreal-forum
   ```

## 2. Add Deployment Configuration
Create these files in your repo:

### Container Configuration
Create `containers/app.yml`:
```yaml
templates:
  - "templates/postgres.template.yml"
  - "templates/redis.template.yml"
  - "templates/web.template.yml"
  - "templates/web.ratelimited.template.yml"

expose:
  - "80:80"
  - "443:443"

params:
  db_default_text_search_config: "pg_catalog.english"
  
env:
  DISCOURSE_HOSTNAME: 'forum.yourdomain.com'
  DISCOURSE_DEVELOPER_EMAILS: 'your@email.com'
  DISCOURSE_SMTP_ADDRESS: smtp.mailgun.org
  DISCOURSE_SMTP_PORT: 587
  DISCOURSE_SMTP_USER_NAME: your-smtp-username
  DISCOURSE_SMTP_PASSWORD: your-smtp-password
  
volumes:
  - volume:
      host: /var/discourse/shared/standalone
      guest: /shared
  - volume:
      host: /var/discourse/shared/standalone/log/var-log
      guest: /var/log

hooks:
  after_code:
    - exec:
        cd: $home
        cmd:
          - git remote add github https://github.com/YOUR-USERNAME/discourse.git
          - git fetch github main
          - git checkout github/main -- plugins/
          - git checkout github/main -- themes/
```

## 3. Create Deployment Key
```bash
ssh-keygen -t ed25519 -C "discourse-deploy" -f discourse-deploy
```

Add the public key to your server and private key to GitHub Secrets.