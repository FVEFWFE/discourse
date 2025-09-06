#!/bin/bash
set -e

echo "Setting up Discourse development environment..."

# Install system dependencies
sudo apt-get update
sudo apt-get install -y \
  git \
  curl \
  wget \
  imagemagick \
  libpq-dev \
  postgresql-client \
  redis-tools

# Install pnpm
npm install -g pnpm

# Clone discourse_docker for development setup
git clone https://github.com/discourse/discourse_docker.git ~/discourse_docker || true

# Install Ruby dependencies
bundle config set --local path 'vendor/bundle'
bundle install

# Install JavaScript dependencies
pnpm install

# Create development database config
cp config/database.yml.development-sample config/database.yml

echo "Setup complete! Next steps:"
echo "1. Set up PostgreSQL and Redis using Docker"
echo "2. Run: bin/rails db:create db:migrate"
echo "3. Run: bin/ember-cli server"
echo "4. In another terminal: bin/rails server"