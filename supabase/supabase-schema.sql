-- ============================================
-- IILIKA GROUPS - Supabase Database Schema
-- Phase 1: Content Management + Submissions
-- ============================================

-- Enable UUID extension (should already be enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TABLE 1: SERVICES
-- 3 pillars (Staffing, GCC, Projects) + sub-services
-- ============================================

CREATE TABLE services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,  -- Supports markdown
  type TEXT NOT NULL CHECK (type IN ('pillar', 'offering')),
  parent_id UUID REFERENCES services(id) ON DELETE SET NULL,
  icon_name TEXT,  -- Lucide icon name (e.g., 'users', 'building')
  icon_url TEXT,   -- Or custom icon from storage
  display_order INTEGER DEFAULT 0,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),
  -- SEO fields
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT[] DEFAULT '{}',
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- Constraint: pillars cannot have a parent
ALTER TABLE services ADD CONSTRAINT services_pillar_no_parent
  CHECK (type != 'pillar' OR parent_id IS NULL);

-- Indexes
CREATE INDEX idx_services_status ON services(status);
CREATE INDEX idx_services_type ON services(type);
CREATE INDEX idx_services_parent ON services(parent_id);
CREATE INDEX idx_services_slug ON services(slug);

-- Trigger for updated_at
CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- TABLE 2: PRODUCTS
-- Tech products, client deliveries, partner tools
-- ============================================

CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  tagline TEXT,  -- Short one-liner
  description TEXT,  -- Supports markdown
  type TEXT NOT NULL CHECK (type IN ('internal', 'client', 'partner')),
  client_name TEXT,  -- For client products
  features TEXT[] DEFAULT '{}',  -- Bullet points
  technologies TEXT[] DEFAULT '{}',
  image_url TEXT,  -- Single product image
  external_url TEXT,  -- Link to live product
  display_order INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),
  -- SEO fields
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT[] DEFAULT '{}',
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- Indexes
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_type ON products(type);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_products_slug ON products(slug);

-- Trigger for updated_at
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- TABLE 3: TEAM MEMBERS
-- About page + blog authors
-- ============================================

CREATE TABLE team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  department TEXT,  -- Engineering, Leadership, Sales, etc.
  bio TEXT,  -- Supports markdown
  photo_url TEXT,
  linkedin_url TEXT,
  email TEXT,  -- Public contact email
  display_order INTEGER DEFAULT 0,
  is_author BOOLEAN DEFAULT FALSE,  -- Can write blog posts
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- Indexes
CREATE INDEX idx_team_members_status ON team_members(status);
CREATE INDEX idx_team_members_is_author ON team_members(is_author);
CREATE INDEX idx_team_members_department ON team_members(department);

-- Trigger for updated_at
CREATE TRIGGER update_team_members_updated_at
  BEFORE UPDATE ON team_members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- TABLE 4: INSIGHTS (Blog)
-- Articles with markdown content
-- ============================================

CREATE TABLE insights (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,  -- Short summary for cards
  content TEXT NOT NULL,  -- Supports markdown
  tags TEXT[] DEFAULT '{}',  -- For filtering
  author_id UUID REFERENCES team_members(id) ON DELETE SET NULL,
  cover_image_url TEXT,
  featured BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  -- SEO fields
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT[] DEFAULT '{}',
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- Indexes
CREATE INDEX idx_insights_status ON insights(status);
CREATE INDEX idx_insights_featured ON insights(featured);
CREATE INDEX idx_insights_author ON insights(author_id);
CREATE INDEX idx_insights_slug ON insights(slug);
CREATE INDEX idx_insights_tags ON insights USING GIN(tags);

-- Trigger for updated_at
CREATE TRIGGER update_insights_updated_at
  BEFORE UPDATE ON insights
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- TABLE 5: CASE STUDIES
-- Client success stories
-- ============================================

CREATE TABLE case_studies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  client_name TEXT,  -- Can be anonymous
  industry TEXT,  -- fintech, healthcare, retail, etc.
  challenge TEXT NOT NULL,  -- Supports markdown
  solution TEXT NOT NULL,  -- Supports markdown
  results TEXT[] DEFAULT '{}',  -- Bullet points
  technologies TEXT[] DEFAULT '{}',
  services_used UUID[] DEFAULT '{}',  -- References to services (nullable)
  thumbnail_url TEXT,
  featured BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  -- SEO fields
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT[] DEFAULT '{}',
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- Indexes
CREATE INDEX idx_case_studies_status ON case_studies(status);
CREATE INDEX idx_case_studies_featured ON case_studies(featured);
CREATE INDEX idx_case_studies_industry ON case_studies(industry);
CREATE INDEX idx_case_studies_slug ON case_studies(slug);

-- Trigger for updated_at
CREATE TRIGGER update_case_studies_updated_at
  BEFORE UPDATE ON case_studies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- TABLE 6: TESTIMONIALS
-- Client quotes for carousel
-- ============================================

CREATE TABLE testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  company TEXT,
  position TEXT,
  quote TEXT NOT NULL,
  logo_url TEXT,  -- Company logo
  display_order INTEGER DEFAULT 0,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- Indexes
CREATE INDEX idx_testimonials_status ON testimonials(status);
CREATE INDEX idx_testimonials_order ON testimonials(display_order);

-- Trigger for updated_at
CREATE TRIGGER update_testimonials_updated_at
  BEFORE UPDATE ON testimonials
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- TABLE 7: PARTNER LOGOS
-- Logo carousel / trust badges
-- ============================================

CREATE TABLE partner_logos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  website_url TEXT,
  type TEXT NOT NULL CHECK (type IN ('client', 'partner', 'technology')),
  display_order INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- Indexes
CREATE INDEX idx_partner_logos_status ON partner_logos(status);
CREATE INDEX idx_partner_logos_type ON partner_logos(type);
CREATE INDEX idx_partner_logos_order ON partner_logos(display_order);

-- Trigger for updated_at
CREATE TRIGGER update_partner_logos_updated_at
  BEFORE UPDATE ON partner_logos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- TABLE 8: CLIENT INQUIRIES
-- Contact form submissions (client tab)
-- ============================================

CREATE TABLE client_inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  service_interest_id UUID REFERENCES services(id) ON DELETE SET NULL,
  service_interest_other TEXT,  -- "General Inquiry" or custom text
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'closed')),
  admin_notes TEXT,  -- Internal notes
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- Indexes
CREATE INDEX idx_client_inquiries_status ON client_inquiries(status);
CREATE INDEX idx_client_inquiries_created ON client_inquiries(created_at DESC);
CREATE INDEX idx_client_inquiries_email ON client_inquiries(email);

-- Trigger for updated_at
CREATE TRIGGER update_client_inquiries_updated_at
  BEFORE UPDATE ON client_inquiries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- TABLE 9: GENERAL APPLICATIONS
-- Contact form submissions (applicant tab)
-- ============================================

CREATE TABLE general_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  linkedin_url TEXT,
  role_interest TEXT,  -- Free text for now
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'shortlisted', 'closed')),
  admin_notes TEXT,  -- Internal notes
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- Indexes
CREATE INDEX idx_general_applications_status ON general_applications(status);
CREATE INDEX idx_general_applications_created ON general_applications(created_at DESC);
CREATE INDEX idx_general_applications_email ON general_applications(email);

-- Trigger for updated_at
CREATE TRIGGER update_general_applications_updated_at
  BEFORE UPDATE ON general_applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- TABLE 10: ADMIN PROFILES
-- Linked to Supabase Auth users
-- ============================================

CREATE TABLE admin_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'hr', 'sales')),
  avatar_url TEXT,
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- Indexes
CREATE INDEX idx_admin_profiles_role ON admin_profiles(role);

-- Trigger for updated_at
CREATE TRIGGER update_admin_profiles_updated_at
  BEFORE UPDATE ON admin_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_logos ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE general_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PUBLIC READ POLICIES (active/published only)
-- ============================================

-- Services: public can read active
CREATE POLICY "Public read active services" ON services
  FOR SELECT USING (status = 'active');

-- Products: public can read active
CREATE POLICY "Public read active products" ON products
  FOR SELECT USING (status = 'active');

-- Team Members: public can read active
CREATE POLICY "Public read active team members" ON team_members
  FOR SELECT USING (status = 'active');

-- Insights: public can read published
CREATE POLICY "Public read published insights" ON insights
  FOR SELECT USING (status = 'published');

-- Case Studies: public can read published
CREATE POLICY "Public read published case studies" ON case_studies
  FOR SELECT USING (status = 'published');

-- Testimonials: public can read active
CREATE POLICY "Public read active testimonials" ON testimonials
  FOR SELECT USING (status = 'active');

-- Partner Logos: public can read active
CREATE POLICY "Public read active partner logos" ON partner_logos
  FOR SELECT USING (status = 'active');

-- ============================================
-- PUBLIC WRITE POLICIES (submissions only)
-- ============================================

-- Client Inquiries: anyone can insert
CREATE POLICY "Public insert client inquiries" ON client_inquiries
  FOR INSERT WITH CHECK (true);

-- General Applications: anyone can insert
CREATE POLICY "Public insert general applications" ON general_applications
  FOR INSERT WITH CHECK (true);

-- ============================================
-- ADMIN POLICIES (authenticated users)
-- ============================================

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_profiles
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Services: admin full access
CREATE POLICY "Admin full access services" ON services
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Products: admin full access
CREATE POLICY "Admin full access products" ON products
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Team Members: admin full access
CREATE POLICY "Admin full access team members" ON team_members
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Insights: admin full access
CREATE POLICY "Admin full access insights" ON insights
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Case Studies: admin full access
CREATE POLICY "Admin full access case studies" ON case_studies
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Testimonials: admin full access
CREATE POLICY "Admin full access testimonials" ON testimonials
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Partner Logos: admin full access
CREATE POLICY "Admin full access partner logos" ON partner_logos
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Client Inquiries: admin can read and update
CREATE POLICY "Admin read client inquiries" ON client_inquiries
  FOR SELECT USING (is_admin());

CREATE POLICY "Admin update client inquiries" ON client_inquiries
  FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Admin delete client inquiries" ON client_inquiries
  FOR DELETE USING (is_admin());

-- General Applications: admin can read and update
CREATE POLICY "Admin read general applications" ON general_applications
  FOR SELECT USING (is_admin());

CREATE POLICY "Admin update general applications" ON general_applications
  FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Admin delete general applications" ON general_applications
  FOR DELETE USING (is_admin());

-- Admin Profiles: users can read/update their own profile
CREATE POLICY "Users read own profile" ON admin_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users update own profile" ON admin_profiles
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Super admin can manage all profiles
CREATE POLICY "Super admin manage profiles" ON admin_profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_profiles
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

-- ============================================
-- SEED DATA: 3 Service Pillars
-- ============================================

INSERT INTO services (slug, title, description, type, icon_name, display_order, status) VALUES
  (
    'staffing',
    'Staffing & Deployed Resources',
    'Access top-tier IT talent for your projects. We provide onsite, hybrid, and remote engineers for both permanent positions and contract engagements.',
    'pillar',
    'users',
    1,
    'active'
  ),
  (
    'gcc-enablement',
    'GCC Enablement',
    'End-to-end support for setting up and scaling your Global Capability Center in India. From talent acquisition to infrastructure partnerships, we handle it all.',
    'pillar',
    'building',
    2,
    'active'
  ),
  (
    'project-delivery',
    'Service-based Project Delivery',
    'Complete project ownership with managed squads and pods. Choose from fixed-scope, T&M, or retainer engagement models tailored to your needs.',
    'pillar',
    'briefcase',
    3,
    'active'
  );

-- ============================================
-- STORAGE BUCKETS
-- ============================================

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) VALUES
  ('logos', 'logos', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']),
  ('team', 'team', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('products', 'products', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('insights', 'insights', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('case-studies', 'case-studies', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- STORAGE RLS POLICIES
-- ============================================

-- Public read access for all buckets
CREATE POLICY "Public read access for logos" ON storage.objects
  FOR SELECT USING (bucket_id = 'logos');

CREATE POLICY "Public read access for team" ON storage.objects
  FOR SELECT USING (bucket_id = 'team');

CREATE POLICY "Public read access for products" ON storage.objects
  FOR SELECT USING (bucket_id = 'products');

CREATE POLICY "Public read access for insights" ON storage.objects
  FOR SELECT USING (bucket_id = 'insights');

CREATE POLICY "Public read access for case-studies" ON storage.objects
  FOR SELECT USING (bucket_id = 'case-studies');

-- Admin upload access (authenticated users who are admins)
CREATE POLICY "Admin upload access" ON storage.objects
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated'
    AND bucket_id IN ('logos', 'team', 'products', 'insights', 'case-studies')
    AND is_admin()
  );

-- Admin update access
CREATE POLICY "Admin update access" ON storage.objects
  FOR UPDATE USING (
    auth.role() = 'authenticated'
    AND bucket_id IN ('logos', 'team', 'products', 'insights', 'case-studies')
    AND is_admin()
  );

-- Admin delete access
CREATE POLICY "Admin delete access" ON storage.objects
  FOR DELETE USING (
    auth.role() = 'authenticated'
    AND bucket_id IN ('logos', 'team', 'products', 'insights', 'case-studies')
    AND is_admin()
  );

-- ============================================
-- TABLE 11: JOB OPENINGS
-- Admin-managed job postings for careers page
-- ============================================

CREATE TABLE job_openings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  department TEXT,
  location TEXT,
  experience TEXT,
  employment_type TEXT DEFAULT 'full-time' CHECK (employment_type IN ('full-time', 'part-time', 'contract')),
  description TEXT,
  tech_stack TEXT[] DEFAULT '{}',
  display_order INTEGER DEFAULT 0,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'closed')),
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- Indexes
CREATE INDEX idx_job_openings_status ON job_openings(status);
CREATE INDEX idx_job_openings_order ON job_openings(display_order);

-- Trigger for updated_at
CREATE TRIGGER update_job_openings_updated_at
  BEFORE UPDATE ON job_openings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ALTER: Add job_opening_id FK to general_applications
-- Links applications to specific job openings (nullable = general application)
-- ============================================

ALTER TABLE general_applications
  ADD COLUMN job_opening_id UUID REFERENCES job_openings(id) ON DELETE SET NULL;

CREATE INDEX idx_general_applications_job_opening ON general_applications(job_opening_id);

-- ============================================
-- RLS for job_openings
-- ============================================

ALTER TABLE job_openings ENABLE ROW LEVEL SECURITY;

-- Public can read active openings
CREATE POLICY "Public read active job openings" ON job_openings
  FOR SELECT USING (status = 'active');

-- Admin full access
CREATE POLICY "Admin full access job openings" ON job_openings
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- ============================================
-- GRANTS (for completeness)
-- ============================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant access to tables
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;

-- Grant access to sequences
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- ============================================
-- END OF SCHEMA
-- ============================================
