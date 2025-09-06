#!/bin/bash
# Webhook receiver script for auto-deployment

# This would run on your DigitalOcean server
# Triggered by GitHub webhook on push events

cd /var/discourse
git pull origin main

# Rebuild Discourse container
./launcher rebuild app

# Optional: Send notification
echo "Deployment completed at $(date)" >> /var/log/discourse-deploy.log