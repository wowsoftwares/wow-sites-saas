# WOW Sites - White Label Website SaaS Platform

A Next.js-based SaaS platform that allows small businesses to sign up, enter their information, and automatically get a professional single-page website deployed on a subdomain.

## Features

- 🚀 **Automatic Website Generation** - Create professional websites from pre-built templates
- 📝 **Multi-step Signup Form** - Easy-to-use form with real-time validation
- 🌐 **Subdomain Management** - Automatic DNS configuration via Cloudflare
- 📧 **Email Notifications** - Welcome and error emails via Brevo
- 🎨 **3 Industry Templates** - Restaurant, Hair Salon, and Plumber templates
- 📱 **Fully Responsive** - Mobile-first design with Tailwind CSS
- ✅ **Real-time Status Updates** - Auto-refreshing success page

## Tech Stack

- **Frontend & Backend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **External Services**: Cloudflare API (DNS), n8n (deployment automation), Brevo (emails)
- **Deployment**: Vercel (Next.js app), Cloudflare Pages (client websites)

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (Supabase or Vercel Postgres recommended)
- Cloudflare account with API token
- Brevo (Sendinblue) account for emails
- n8n instance for deployment automation (optional for MVP testing)

## Setup Instructions

### 1. Clone and Install

```bash
# Install dependencies
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in all required values:

```bash
cp .env.example .env.local
```

Required environment variables:
- `DATABASE_URL` - PostgreSQL connection string (from Supabase Dashboard → Settings → Database → Connection String → URI)
  - **Recommended format for production:** Use connection pooling: `postgresql://postgres.xxxxx:[PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1`
  - See `SUPABASE_SETUP.md` for detailed instructions
- `CLOUDFLARE_API_TOKEN` - Cloudflare API token with DNS:Edit permissions
- `CLOUDFLARE_ZONE_ID` - Your Cloudflare zone ID
- `BREVO_API_KEY` - Brevo API key for sending emails
- `N8N_WEBHOOK_URL` - (Optional) n8n webhook URL for deployment automation

### 3. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate
```

### 4. Development

```bash
# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the application.

### 5. Production Deployment

#### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add all environment variables in Vercel dashboard
4. Deploy

#### DNS Configuration

In Cloudflare DNS for your domain:

1. Add A record for `app.saas` pointing to Vercel
2. Add wildcard CNAME `*.saas` pointing to Cloudflare Pages (or your deployment target)

## Project Structure

```
/app
  /page.tsx                    # Landing page
  /signup/page.tsx             # Signup form
  /success/page.tsx            # Success page after signup
  /dashboard/[clientId]/page.tsx  # Client dashboard
  /api
    /check-subdomain/route.ts  # Check if subdomain is available
    /create-site/route.ts      # Main API - creates site
    /update-deployment/route.ts # Webhook from n8n to update status
    /client-status/route.ts    # Get client deployment status
    /client/[clientId]/route.ts # Get client data
/components
  /forms
    /SignupForm.tsx            # Main signup form component
/lib
  /db.ts                       # Database client
  /validations.ts              # Zod schemas
  /cloudflare.ts               # Cloudflare API functions
  /email.ts                    # Brevo email functions
  /template-generator.ts       # Template generation logic
  /constants.ts                # App constants
/prisma
  /schema.prisma               # Database schema
/templates
  /restaurant.ts               # Restaurant template
  /salon.ts                    # Salon template  
  /plumber.ts                  # Plumber template
```

## API Routes

### `GET /api/check-subdomain?subdomain=xxx`
Checks if a subdomain is available. Rate limited to 10 requests per minute per IP.

### `POST /api/create-site`
Creates a new client site. Validates input, creates database record, and triggers n8n webhook.

**Request Body:**
```json
{
  "businessName": "Joe's Pizza",
  "subdomain": "joes-pizza",
  "industry": "restaurant",
  "email": "contact@joespizza.com",
  "phone": "+1 234 567 8900",
  "address": "123 Main St",
  "aboutUs": "Best pizza in town",
  "services": ["Pizza", "Pasta", "Salads"],
  "hours": {},
  "socialLinks": {}
}
```

### `POST /api/update-deployment`
Webhook endpoint for n8n to update deployment status.

**Request Body:**
```json
{
  "clientId": "xxx",
  "status": "active",
  "deploymentUrl": "https://...",
  "secret": "webhook_secret"
}
```

## Templates

The platform includes 3 pre-built templates:

1. **Restaurant** - Orange/red color scheme, menu showcase, location section
2. **Hair Salon** - Purple/pink color scheme, services grid, booking form
3. **Plumber** - Blue/gray color scheme, service list, emergency contact

All templates include:
- Responsive design (mobile-first)
- Contact forms with JavaScript validation
- SEO meta tags
- Social media links support
- Business hours support

## n8n Workflow Setup

The n8n workflow should:

1. Receive webhook from Next.js with client data
2. Generate HTML using template generator
3. Deploy to Cloudflare Pages (or GitHub Pages)
4. Create DNS record via Cloudflare API
5. Call `/api/update-deployment` with results

## Testing Checklist

Before deploying to production:

- [ ] Signup flow (all 5 steps)
- [ ] Subdomain availability checking
- [ ] All 3 templates render correctly
- [ ] API creates database record
- [ ] n8n webhook receives data correctly
- [ ] DNS record created in Cloudflare
- [ ] Success page shows correct info
- [ ] Dashboard displays client data
- [ ] Email notifications sent
- [ ] Responsive design on mobile/tablet/desktop
- [ ] Error handling (invalid inputs, duplicate subdomain, API failures)
- [ ] Loading states work properly

## Future Enhancements (Phase 2)

- Custom color schemes
- Image uploads (Cloudflare R2)
- Contact form backend API
- Form spam protection (reCAPTCHA/Turnstile)
- Custom domain support
- Template editing (visual editor)
- Stripe payment integration
- Client portal for content editing

## Security

- All user inputs validated with Zod
- Rate limiting on API routes
- CSRF protection (Next.js built-in)
- SQL injection protection (Prisma)
- HTML sanitization in templates
- Webhook secret verification
- Environment variables for secrets

## License

Private - All rights reserved

## Support

For issues or questions, contact support@wow-sites.com
