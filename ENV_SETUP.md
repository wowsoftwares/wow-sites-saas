# Environment Variables Setup

## Overview

This project uses a **single source of truth** for environment variables: `.env.local`

## Why This Approach?

✅ **Professional & Production-Ready:**
- Single source of truth (no duplication)
- Explicit loading (transparent and predictable)
- Works consistently across all environments
- Secure (`.env.local` is gitignored)

✅ **Safe:**
- All sensitive data in one place
- No risk of committing secrets
- Easy to manage and audit

## How It Works

1. **Next.js** automatically loads `.env.local` at runtime
2. **Prisma CLI** commands use `dotenv-cli` to explicitly load `.env.local`
3. All environment variables are stored in `.env.local`

## Setup

1. Copy the example file:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in all required variables in `.env.local`

3. That's it! Both Next.js and Prisma will use `.env.local`

## Available Commands

All Prisma commands automatically load from `.env.local`:

```bash
npm run db:generate  # Generates Prisma client
npm run db:migrate   # Runs database migrations
npm run db:studio    # Opens Prisma Studio
```

## Environment Variables

Required variables in `.env.local`:

```bash
# Database
DATABASE_URL="postgresql://..."

# Cloudflare
CLOUDFLARE_API_TOKEN="..."
CLOUDFLARE_ACCOUNT_ID="..."
CLOUDFLARE_ZONE_ID="..."

# n8n
N8N_WEBHOOK_URL="..."
N8N_WEBHOOK_SECRET="..."

# App
NEXT_PUBLIC_BASE_DOMAIN="wow-sites.com"
NEXT_PUBLIC_APP_URL="https://app.saas.wow-sites.com"
NEXT_PUBLIC_SAAS_DOMAIN="saas.wow-sites.com"

# Email (Brevo)
BREVO_API_KEY="..."
BREVO_SENDER_EMAIL="noreply@wow-sites.com"
BREVO_SENDER_NAME="WOW Sites"
```

## Production Deployment

In production (Vercel, etc.), add all environment variables in the platform's dashboard. They will be loaded automatically - no `.env.local` file needed in production.

## Troubleshooting

### Prisma can't find DATABASE_URL
- Make sure `.env.local` exists in the project root
- Verify `DATABASE_URL` is set in `.env.local`
- Check for syntax errors (quotes, special characters)
- If password contains special characters, URL-encode them

### Next.js can't find environment variables
- Make sure variables starting with `NEXT_PUBLIC_` are prefixed correctly
- Restart the dev server after changing `.env.local`
- Check that `.env.local` is in the project root (same level as `package.json`)

## Security Notes

- ✅ `.env.local` is in `.gitignore` - never commit it
- ✅ Use different values for development and production
- ✅ Rotate secrets regularly
- ✅ Never share `.env.local` files
- ✅ Use environment variables in CI/CD pipelines
