#!/bin/bash
# Run this on your DigitalOcean droplet

# Update system
apt update && apt upgrade -y

# Install Docker
apt install -y docker.io git

# Clone discourse_docker
git clone https://github.com/discourse/discourse_docker.git /var/discourse
cd /var/discourse

# Set up GitHub sync
cat > /usr/local/bin/discourse-sync << 'EOF'
#!/bin/bash
cd /var/discourse

# Backup custom files
mkdir -p /tmp/discourse-backup
cp -r plugins/* /tmp/discourse-backup/plugins/ 2>/dev/null || true
cp -r themes/* /tmp/discourse-backup/themes/ 2>/dev/null || true

# Pull from your GitHub repo
git remote add github https://github.com/YOUR-USERNAME/discourse.git 2>/dev/null || true
git fetch github main

# Restore custom files
cp -r /tmp/discourse-backup/plugins/* plugins/ 2>/dev/null || true
cp -r /tmp/discourse-backup/themes/* themes/ 2>/dev/null || true

# Check for changes
if [ "$1" == "rebuild" ]; then
  ./launcher rebuild app
else
  ./launcher restart app
fi
EOF

chmod +x /usr/local/bin/discourse-sync

# Create webhook receiver
cat > /usr/local/bin/github-webhook << 'EOF'
#!/bin/bash
# Simple webhook receiver for GitHub
# In production, use a proper webhook handler

while true; do
  echo "Checking for updates..."
  /usr/local/bin/discourse-sync
  sleep 300 # Check every 5 minutes
done
EOF

chmod +x /usr/local/bin/github-webhook

# Set up as service
cat > /etc/systemd/system/discourse-sync.service << EOF
[Unit]
Description=Discourse GitHub Sync
After=docker.service

[Service]
Type=simple
ExecStart=/usr/local/bin/github-webhook
Restart=always

[Install]
WantedBy=multi-user.target
EOF

systemctl enable discourse-sync
systemctl start discourse-sync

echo "Server setup complete!"
echo "Next: Run ./discourse-setup to configure Discourse"