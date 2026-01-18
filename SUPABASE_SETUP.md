# Supabase Setup Guide for IILIKA GROUPS

This guide will walk you through setting up Supabase for the IILIKA GROUPS website.

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Enter project details:
   - **Name**: iilika-groups
   - **Database Password**: (choose a strong password and save it)
   - **Region**: Choose closest to your users (e.g., Mumbai for India)
5. Click "Create new project"
6. Wait for the project to finish setting up (takes 1-2 minutes)

## Step 2: Get Your API Credentials

1. In your Supabase project dashboard, click on the **Settings** icon (gear icon)
2. Click on **API** in the left sidebar
3. You'll see:
   - **Project URL** - Copy this
   - **anon public** key - Copy this

4. Create a `.env.local` file in your project root:
```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 3: Create Database Tables

Go to the **SQL Editor** in your Supabase dashboard and run these SQL commands:

### 1. Services Table
```sql
CREATE TABLE services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable Row Level Security
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" ON services
  FOR SELECT USING (true);
```

### 2. Careers Openings Table
```sql
CREATE TABLE careers_openings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  location TEXT NOT NULL,
  experience TEXT NOT NULL,
  tech_stack TEXT[] DEFAULT '{}',
  description TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'filled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable Row Level Security
ALTER TABLE careers_openings ENABLE ROW LEVEL SECURITY;

-- Allow public read access for active openings
CREATE POLICY "Allow public read access for active openings" ON careers_openings
  FOR SELECT USING (status = 'active');
```

### 3. Testimonials Table
```sql
CREATE TABLE testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  quote TEXT NOT NULL,
  company TEXT,
  position TEXT,
  logo_url TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable Row Level Security
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Allow public read access for active testimonials
CREATE POLICY "Allow public read access for active testimonials" ON testimonials
  FOR SELECT USING (status = 'active');
```

### 4. Case Studies Table (Week 2 Feature)
```sql
CREATE TABLE case_studies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  client_name TEXT,
  challenge TEXT NOT NULL,
  solution TEXT NOT NULL,
  results TEXT[] DEFAULT '{}',
  technologies TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable Row Level Security
ALTER TABLE case_studies ENABLE ROW LEVEL SECURITY;

-- Allow public read access for published case studies
CREATE POLICY "Allow public read access for published case studies" ON case_studies
  FOR SELECT USING (status = 'published');
```

### 5. Insights/Blog Table (Week 3 Feature)
```sql
CREATE TABLE insights (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  category TEXT,
  author TEXT,
  cover_image_url TEXT,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable Row Level Security
ALTER TABLE insights ENABLE ROW LEVEL SECURITY;

-- Allow public read access for published insights
CREATE POLICY "Allow public read access for published insights" ON insights
  FOR SELECT USING (status = 'published');
```

## Step 4: Insert Sample Data

### Sample Testimonials
```sql
INSERT INTO testimonials (client_name, quote, company, position, status, display_order) VALUES
  ('Rajesh Kumar', 'IILIKA GROUPS helped us build our GCC in Pune with exceptional talent. Their end-to-end support made the entire process seamless.', 'Global Tech Corp', 'VP Engineering', 'active', 1),
  ('Sarah Johnson', 'The deployed resources from IILIKA have been instrumental in scaling our development team. Professional, skilled, and committed.', 'FinTech Solutions', 'CTO', 'active', 2),
  ('Amit Patel', 'Outstanding project delivery! Their managed squads delivered our mobile app ahead of schedule with excellent quality.', 'Retail Innovations', 'Head of Product', 'active', 3),
  ('Lisa Chen', 'IILIKA''s staffing services are top-notch. They understand our technical requirements and consistently deliver the right talent.', 'Cloud Systems Inc', 'Engineering Director', 'active', 4);
```

### Sample Career Openings
```sql
INSERT INTO careers_openings (title, slug, location, experience, tech_stack, description, status) VALUES
  ('Senior Full Stack Developer', 'senior-full-stack-developer', 'Pune / Remote', '5-8 years', ARRAY['React', 'Node.js', 'TypeScript', 'AWS'], 'We are looking for an experienced Full Stack Developer to join our team.', 'active'),
  ('DevOps Engineer', 'devops-engineer', 'Pune / Hybrid', '3-5 years', ARRAY['Docker', 'Kubernetes', 'AWS', 'CI/CD'], 'Join our DevOps team to build scalable infrastructure.', 'active'),
  ('Java Backend Developer', 'java-backend-developer', 'Client Location', '4-7 years', ARRAY['Java', 'Spring Boot', 'Microservices', 'PostgreSQL'], 'Experienced Java developer needed for enterprise projects.', 'active'),
  ('React Native Developer', 'react-native-developer', 'Remote', '3-6 years', ARRAY['React Native', 'JavaScript', 'Mobile Development'], 'Build mobile applications for leading enterprises.', 'active'),
  ('Data Engineer', 'data-engineer', 'Pune / Remote', '4-6 years', ARRAY['Python', 'Spark', 'AWS', 'Data Pipelines'], 'Work on large-scale data engineering projects.', 'active');
```

## Step 5: Install Supabase Client

Install the Supabase client library in your Next.js project:

```bash
npm install @supabase/supabase-js
```

## Step 6: Create Supabase Client

Create a file `lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

## Step 7: Verify Setup

1. Go to the **Table Editor** in Supabase
2. You should see all your tables: `services`, `careers_openings`, `testimonials`, `case_studies`, `insights`
3. Click on each table to verify the sample data was inserted

## Next Steps

- **Week 1**: Update the Testimonials carousel to fetch from Supabase
- **Week 2**: Update the Careers page to fetch job openings from Supabase
- **Week 3**: Implement Case Studies feature
- **Week 4**: Implement Insights/Blog feature

## Security Notes

- Row Level Security (RLS) is enabled on all tables
- Public read access is granted only for active/published content
- Write access will be implemented later with authentication for the admin panel

## Troubleshooting

**Issue**: Can't connect to Supabase
- Verify your `.env.local` file has the correct credentials
- Make sure the file is in the project root
- Restart your Next.js dev server

**Issue**: Tables not showing up
- Check the SQL Editor for any errors
- Make sure you ran all the SQL commands
- Refresh the Table Editor page

**Issue**: Sample data not inserted
- Check for SQL syntax errors
- Make sure the tables were created first
- Try inserting one record at a time

## Support

For Supabase-specific issues, check:
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
