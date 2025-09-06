# Railway Deployment for Discourse

## Prerequisites
- Railway account (railway.app)
- GitHub repository with Discourse

## Setup Steps

### 1. Create railway.toml
```toml
[build]
builder = "dockerfile"
dockerfilePath = "Dockerfile"

[deploy]
startCommand = "docker/supervisord -c /etc/supervisord.conf"
healthcheckPath = "/"
healthcheckTimeout = 300
restartPolicyType = "always"

[[services]]
name = "web"
port = 3000

[[services]]
name = "postgres"
image = "postgres:13"

[[services]]
name = "redis"
image = "redis:7-alpine"
```

### 2. Create Dockerfile
```dockerfile
FROM discourse/base:latest

WORKDIR /var/www/discourse

# Copy your custom plugins and themes
COPY plugins/ plugins/
COPY themes/ themes/

# Install dependencies
RUN bundle install --deployment --without test development
RUN yarn install --production

# Precompile assets
RUN RAILS_ENV=production bundle exec rake assets:precompile

EXPOSE 3000

CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0"]
```

### 3. Environment Variables in Railway
- DISCOURSE_HOSTNAME
- DISCOURSE_SMTP_ADDRESS
- DISCOURSE_SMTP_PORT
- DISCOURSE_SMTP_USER_NAME
- DISCOURSE_SMTP_PASSWORD
- DISCOURSE_DB_HOST (use Railway's Postgres)
- DISCOURSE_REDIS_HOST (use Railway's Redis)

### 4. Deploy
1. Connect GitHub repo to Railway
2. Railway auto-deploys on push
3. Custom domain in Railway settings
```