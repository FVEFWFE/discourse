# DigitalOcean Auto-Deploy Setup

## Prerequisites
1. DigitalOcean Droplet with Discourse installed
2. GitHub repository (your fork of Discourse)
3. SSH key pair for deployment

## Step 1: Generate Deploy Key
On your local machine:
```bash
ssh-keygen -t ed25519 -C "github-deploy" -f ~/.ssh/github-deploy
```

## Step 2: Add Deploy Key to Server
Copy the public key to your DigitalOcean droplet:
```bash
ssh-copy-id -i ~/.ssh/github-deploy.pub root@YOUR_DROPLET_IP
```

## Step 3: Configure GitHub Secrets
In your GitHub repo, go to Settings > Secrets and add:
- `HOST`: Your droplet's IP address
- `USERNAME`: root (or your username)
- `SSH_KEY`: Contents of ~/.ssh/github-deploy (private key)

## Step 4: Create Deployment Script on Server
SSH into your droplet and create:
```bash
nano /root/deploy-discourse.sh
```

Add:
```bash
#!/bin/bash
cd /var/discourse
git fetch origin
git reset --hard origin/main
./launcher rebuild app
```

Make it executable:
```bash
chmod +x /root/deploy-discourse.sh
```

## Step 5: Enable GitHub Actions
The workflow file (.github/workflows/deploy.yml) will now automatically:
1. Trigger on pushes to main branch
2. SSH into your server
3. Pull latest changes
4. Rebuild Discourse

## Manual Trigger
You can also manually trigger deployment from GitHub Actions tab.

## Important Notes
- Rebuilds take 5-10 minutes
- Site will be down during rebuild
- Consider setting up a maintenance page
- Test on a staging server first