# Cursor Agent Workflow

## How It Works

1. **Cursor Agent makes changes** → Creates PR
2. **PR triggers staging deployment** → Test changes
3. **Merge PR** → Auto-deploys to production

## For Cursor Agent:

### Creating Theme Changes
```bash
# Work in themes directory
themes/unreal-engine/
├── about.json
├── common/common.scss
├── desktop/desktop.scss
└── mobile/mobile.scss
```

### Creating Plugin Changes  
```bash
# Work in plugins directory
plugins/discourse-unreal-features/
├── plugin.rb
├── config/settings.yml
└── assets/javascripts/
```

### Deployment Commands

**Create PR for changes:**
```bash
git checkout -b cursor-update-001
git add .
git commit -m "Cursor: Add UE marketplace features"
git push origin cursor-update-001
```

**The system will:**
1. Deploy to staging automatically
2. Comment on PR with staging link
3. Deploy to production when merged

## Server URLs

- **Production**: https://forum.yourdomain.com
- **Staging**: https://staging.yourdomain.com
- **GitHub Actions**: https://github.com/YOUR-USERNAME/discourse/actions

## What Cursor CAN Edit

✅ **Themes** - Full visual customization
✅ **Plugins** - New features
✅ **Translations** - i18n files
✅ **Settings** - config/site_settings.yml

## What Cursor CANNOT Edit

❌ Core Discourse files
❌ Database directly  
❌ User data
❌ Security settings

## Example PR Flow

1. Cursor creates branch: `cursor-add-marketplace`
2. Makes changes to files
3. Creates PR
4. Staging auto-deploys in ~5 minutes
5. You review staging site
6. Merge PR → Production updates

This gives you the full GitHub workflow with automatic deployment!