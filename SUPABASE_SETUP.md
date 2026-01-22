# Supabase Database Setup Guide

## Two Connection Methods Explained

### Option 1: Connection String (Recommended for This Project ✅)

**What it is:**
- Direct PostgreSQL connection string
- Format: `postgresql://postgres:[PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres`

**Best for:**
- ✅ **This project** - You're using Prisma ORM
- Server-side only database access
- Direct SQL/Prisma queries
- Maximum performance (no abstraction layer)
- Full control over database operations

**Security:**
- ✅ **Very secure** - Only accessible from server-side code
- Never exposed to client
- Uses connection pooling (pgbouncer) for efficiency

**Setup:**
1. Go to Supabase Dashboard → Settings → Database
2. Click "Connection String" tab
3. Select "URI" format
4. Copy the connection string
5. Add `?pgbouncer=true&connection_limit=1` at the end for connection pooling
6. Use it as `DATABASE_URL` in your `.env.local`

**Example:**
```bash
DATABASE_URL="postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
```

---

### Option 2: Supabase Client (App Frameworks)

**What it is:**
- Supabase JavaScript client library
- Provides: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Best for:**
- Client-side database access
- Supabase Authentication
- Supabase Storage (file uploads)
- Real-time subscriptions
- Row Level Security (RLS) policies
- When you want Supabase's full feature set

**Security:**
- ⚠️ **Less secure for direct DB access** - Anon key is public
- Requires Row Level Security (RLS) policies for security
- Better for client-side operations with proper RLS

**Setup:**
1. Go to Supabase Dashboard → Settings → API
2. Copy `NEXT_PUBLIC_SUPABASE_URL`
3. Copy `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Install `@supabase/supabase-js` package
5. Create Supabase client instances

---

## Recommendation for This Project

### ✅ Use Connection String (Option 1)

**Why:**
1. **You're using Prisma** - Prisma works directly with PostgreSQL connection strings
2. **Server-side only** - All your API routes are server-side, no client-side DB access needed
3. **Better performance** - Direct connection, no abstraction overhead
4. **Simpler setup** - No need for Supabase client library
5. **More secure** - Connection string never exposed to client
6. **Future-proof** - Easy to migrate to any PostgreSQL provider later

### When to Use Supabase Client Instead:

Consider switching to Supabase Client if you later need:
- User authentication (Supabase Auth)
- File storage (Supabase Storage)
- Real-time features (live updates)
- Client-side database queries

You can actually use **both**:
- Connection String for Prisma (server-side)
- Supabase Client for auth/storage (when needed)

---

## Setup Instructions

### Step 1: Get Connection String from Supabase

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **Database**
3. Find the **Connection String** section
4. Select the **URI** tab
5. Copy the connection string

### Step 2: Choose Connection Pooling Mode

**For Development:**
```bash
# Direct connection (faster, simpler)
DATABASE_URL="postgresql://postgres:[PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres"
```

**For Production (Recommended):**
```bash
# Connection pooling (better for serverless, handles many connections)
DATABASE_URL="postgresql://postgres.xxxxx:[PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
```

**Important:** 
- Use port `5432` for direct connection
- Use port `6543` for connection pooling (pgbouncer)
- Add `?pgbouncer=true&connection_limit=1` for pooling mode

### Step 3: Add to Environment Variables

Add to your `.env.local`:
```bash
DATABASE_URL="postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
```

### Step 4: Test Connection

```bash
# Generate Prisma client
npm run db:generate

# Test connection with Prisma Studio
npm run db:studio

# Or run a migration
npm run db:migrate
```

---

## Security Best Practices

1. ✅ **Never commit** `.env.local` to git
2. ✅ **Use connection pooling** in production (port 6543)
3. ✅ **Rotate passwords** regularly in Supabase dashboard
4. ✅ **Use environment variables** in Vercel/deployment platform
5. ✅ **Limit connection pool size** (`connection_limit=1` for serverless)

---

## Troubleshooting

### "Connection timeout" errors
- Use connection pooling mode (port 6543)
- Add `?pgbouncer=true&connection_limit=1`

### "Too many connections" errors
- Reduce `connection_limit` parameter
- Use connection pooling instead of direct connection

### Prisma migration fails
- Make sure you're using the correct connection string format
- Check that your Supabase database is accessible
- Verify password is correct

---

## Migration Path (If Needed Later)

If you later want to add Supabase Auth or Storage:

1. Install Supabase client:
   ```bash
   npm install @supabase/supabase-js
   ```

2. Add environment variables:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
   ```

3. Keep using Connection String for Prisma
4. Use Supabase Client only for auth/storage features

This way you get the best of both worlds!
