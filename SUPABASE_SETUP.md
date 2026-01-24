# Supabase Setup Guide for IILIKA GROUPS

Complete guide to set up Supabase backend for the IILIKA GROUPS website.

## Prerequisites

- Supabase account (free tier works)
- Node.js 18+ installed
- Project cloned locally

---

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click **"New Project"**
4. Enter project details:
   - **Name**: `iilika-groups`
   - **Database Password**: Choose a strong password (save it securely)
   - **Region**: Mumbai (ap-south-1) - closest to India
5. Click **"Create new project"**
6. Wait for setup to complete (1-2 minutes)

---

## Step 2: Get Your API Credentials

1. In Supabase dashboard, click **Settings** (gear icon)
2. Click **API** in the left sidebar
3. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (starts with `eyJ...`)

4. Create `.env.local` in your project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Important**: Never commit `.env.local` to git. It should already be in `.gitignore`.

---

## Step 3: Run the Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click **"New query"**
3. Copy the entire contents of `supabase/supabase-schema.sql`
4. Paste into the SQL Editor
5. Click **"Run"** (or press Ctrl+Enter)
6. Wait for all statements to execute (green checkmarks)

The schema creates:
- 10 database tables with proper constraints
- Row Level Security (RLS) policies
- Indexes for common queries
- Trigger for auto-updating `updated_at`
- Seed data for 3 service pillars

---

## Step 4: Create Storage Buckets

1. In Supabase dashboard, go to **Storage**
2. Click **"New bucket"** and create these 5 buckets:

| Bucket Name | Public | Purpose |
|-------------|--------|---------|
| `logos` | Yes | Partner/company logos |
| `team` | Yes | Team member photos |
| `products` | Yes | Product screenshots |
| `insights` | Yes | Blog cover images |
| `case-studies` | Yes | Case study thumbnails |

3. For each bucket, enable **public access**:
   - Click on the bucket
   - Go to **Policies**
   - Add policy: "Allow public read access"
   ```sql
   CREATE POLICY "Public read access" ON storage.objects
   FOR SELECT USING (bucket_id = 'bucket-name');
   ```

**Or run this SQL to create all buckets with policies:**

```sql
-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES
  ('logos', 'logos', true),
  ('team', 'team', true),
  ('products', 'products', true),
  ('insights', 'insights', true),
  ('case-studies', 'case-studies', true)
ON CONFLICT (id) DO NOTHING;

-- Public read policy for all buckets
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT USING (bucket_id IN ('logos', 'team', 'products', 'insights', 'case-studies'));

-- Admin write policy (authenticated users only)
CREATE POLICY "Admin write access" ON storage.objects
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin update access" ON storage.objects
FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin delete access" ON storage.objects
FOR DELETE USING (auth.role() = 'authenticated');
```

---

## Step 5: Create First Admin User

1. In Supabase dashboard, go to **Authentication**
2. Click **Users** tab
3. Click **"Add user"** → **"Create new user"**
4. Enter:
   - **Email**: Your admin email
   - **Password**: Strong password
   - Check **"Auto Confirm User"**
5. Click **"Create user"**
6. Copy the **User UID** (you'll need it)

7. Now create the admin profile. Go to **SQL Editor** and run:

```sql
INSERT INTO admin_profiles (id, full_name, role)
VALUES (
  'paste-user-uid-here',  -- Replace with actual UID
  'Your Name',
  'super_admin'
);
```

---

## Step 6: Install Supabase Client

In your project directory:

```bash
npm install @supabase/supabase-js
```

---

## Step 7: Create Supabase Client File

Create `src/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// For server-side operations (API routes, Server Components)
export const createServerSupabaseClient = () => {
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false
    }
  })
}
```

---

## Step 8: Generate TypeScript Types (Optional but Recommended)

Install Supabase CLI:

```bash
npm install -D supabase
```

Login and generate types:

```bash
npx supabase login
npx supabase gen types typescript --project-id your-project-id > src/types/database.ts
```

Replace `your-project-id` with your actual project ID (found in project settings).

---

## Step 9: Verify Setup

### Check Tables
1. Go to **Table Editor** in Supabase
2. Verify all 10 tables exist:
   - `services` (with 3 seed records)
   - `products`
   - `insights`
   - `case_studies`
   - `testimonials`
   - `team_members`
   - `partner_logos`
   - `client_inquiries`
   - `general_applications`
   - `admin_profiles`

### Test Connection
Create a simple test in your app:

```typescript
import { supabase } from '@/lib/supabase'

// Fetch services
const { data, error } = await supabase
  .from('services')
  .select('*')
  .eq('status', 'active')

console.log('Services:', data)
console.log('Error:', error)
```

---

## Database Schema Overview

### Content Tables (Admin CRUD)

| Table | Purpose | Public Read |
|-------|---------|-------------|
| `services` | Service pillars + offerings | active only |
| `products` | Product showcase | active only |
| `insights` | Blog articles | published only |
| `case_studies` | Case studies | published only |
| `testimonials` | Client testimonials | active only |
| `team_members` | Team bios | active only |
| `partner_logos` | Logo carousel | active only |

### Submission Tables

| Table | Purpose | Public Write |
|-------|---------|--------------|
| `client_inquiries` | Contact form (clients) | insert only |
| `general_applications` | Contact form (applicants) | insert only |

### System Tables

| Table | Purpose |
|-------|---------|
| `admin_profiles` | Admin user profiles + roles |

---

## RLS Policies Summary

All tables have Row Level Security enabled:

| Access Type | Who | What |
|-------------|-----|------|
| Public SELECT | Anyone | Only `active`/`published` content |
| Public INSERT | Anyone | Only `client_inquiries`, `general_applications` |
| Admin SELECT | Authenticated | All records regardless of status |
| Admin INSERT/UPDATE/DELETE | Authenticated | Full access to all tables |

---

## Common Queries

### Fetch Active Services (with hierarchy)

```typescript
// Get all pillars
const { data: pillars } = await supabase
  .from('services')
  .select('*')
  .eq('type', 'pillar')
  .eq('status', 'active')
  .order('display_order')

// Get offerings under a pillar
const { data: offerings } = await supabase
  .from('services')
  .select('*')
  .eq('parent_id', pillarId)
  .eq('status', 'active')
  .order('display_order')
```

### Fetch Featured Products

```typescript
const { data: featured } = await supabase
  .from('products')
  .select('*')
  .eq('status', 'active')
  .eq('featured', true)
  .order('display_order')
  .limit(3)
```

### Fetch Insights with Author

```typescript
const { data: posts } = await supabase
  .from('insights')
  .select(`
    *,
    author:team_members(name, position, photo_url)
  `)
  .eq('status', 'published')
  .order('created_at', { ascending: false })
```

### Submit Client Inquiry

```typescript
const { error } = await supabase
  .from('client_inquiries')
  .insert({
    company_name: 'Acme Corp',
    contact_name: 'John Doe',
    email: 'john@acme.com',
    service_interest_id: serviceId, // or null
    service_interest_other: 'General Inquiry',
    message: 'We need help with...'
  })
```

---

## Environment Variables for Deployment

### Vercel

Add these in Vercel dashboard → Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### Local Development

Use `.env.local` file (already in `.gitignore`).

---

## Troubleshooting

### "relation does not exist" error
- Make sure you ran the complete SQL schema
- Check for any errors in SQL Editor output
- Verify you're connected to the correct project

### "permission denied" error
- RLS policies might be blocking access
- For public data, ensure status is `active`/`published`
- For admin operations, ensure user is authenticated

### Can't connect to Supabase
- Verify `.env.local` has correct values
- Restart Next.js dev server after changing env vars
- Check if Supabase project is paused (free tier pauses after 1 week of inactivity)

### Types not matching
- Regenerate types: `npx supabase gen types typescript --project-id xxx`
- Make sure schema changes are saved

---

## Next Steps

1. **Build Admin Panel**: Create `/admin` routes with authentication
2. **Integrate Frontend**: Connect existing components to Supabase data
3. **Test Forms**: Verify contact form submissions work
4. **Add Content**: Populate testimonials, case studies, etc.

---

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Next.js + Supabase Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Supabase Discord](https://discord.supabase.com)
