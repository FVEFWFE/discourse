# Cursor Agent Workflow for Discourse Development

## Overview
This workflow allows Cursor Agents to develop Discourse themes and plugins by working with files in the GitHub repository.

## Setup

### 1. Development Structure
```
discourse-unreal-forum/
├── themes/              # Theme development
│   ├── unreal-dark/
│   │   ├── about.json
│   │   ├── common/
│   │   └── assets/
├── plugins/             # Plugin development  
│   ├── discourse-ue-marketplace/
│   │   ├── plugin.rb
│   │   └── assets/
├── config/              # Configuration overrides
│   └── settings.yml
└── scripts/            # Deployment scripts
    └── deploy.sh
```

### 2. Development Server
- Staging server that auto-pulls from GitHub
- Rebuilds every 15 minutes or on webhook
- Accessible at: staging.yourforum.com

### 3. Workflow
1. Cursor Agent edits files in this repo
2. Changes are committed to GitHub
3. Staging server auto-updates
4. Test changes on staging
5. Deploy to production when ready

## Available Commands

### Deploy to Staging
```bash
./scripts/deploy-staging.sh
```

### Deploy to Production  
```bash
./scripts/deploy-production.sh
```

### Create New Theme
```bash
./scripts/create-theme.sh "Theme Name"
```

### Create New Plugin
```bash
./scripts/create-plugin.sh "plugin-name"
```

## File Types Cursor Can Edit

### ✅ Safe to Edit
- Theme SCSS/CSS files
- Theme JavaScript  
- Plugin Ruby files (with care)
- Configuration YML files
- Translation files

### ⚠️ Edit with Caution  
- Database migrations
- Core overrides
- Security settings

### ❌ Don't Edit
- Core Discourse files
- Database directly
- User data

## Testing Changes

Since Cursor Agents can't run local servers, use:
1. Staging server (auto-updates from GitHub)
2. Preview via screenshots/descriptions
3. GitHub Actions test results