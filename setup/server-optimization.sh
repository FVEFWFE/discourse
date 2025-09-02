#!/bin/bash
# Optimize $12/month DigitalOcean droplet for Discourse

# 1. Create swap file (important for 2GB RAM)
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab

# 2. Optimize PostgreSQL for 2GB RAM
cat >> /var/discourse/containers/app.yml << 'EOF'
  
  # PostgreSQL optimizations for 2GB RAM
  - exec: 
      cmd:
        - sed -i "s/shared_buffers = .*/shared_buffers = 256MB/" /etc/postgresql/13/main/postgresql.conf
        - sed -i "s/work_mem = .*/work_mem = 4MB/" /etc/postgresql/13/main/postgresql.conf
EOF

# 3. Set up automatic updates
apt install -y unattended-upgrades
dpkg-reconfigure -plow unattended-upgrades

echo "✅ Server optimized for 2GB RAM!"