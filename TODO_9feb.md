# IILIKA GROUPS - Roadmap (9 Feb 2026)

## What's Been Completed

### Core Website
- [x] All public pages built (Home, About, Services, GCC, Staffing, Projects, Products, Insights, Case Studies, Careers, Contact)
- [x] Dynamic slug pages (`/products/[slug]`, `/insights/[slug]`, `/case-studies/[slug]`, `/services/[slug]`)
- [x] Header navigation with dropdowns
- [x] Footer
- [x] Hero section with video
- [x] Testimonials carousel
- [x] Services/Products carousel component on service pages

### Admin Panel
- [x] Authentication (Supabase Auth + admin_profiles verification)
- [x] Dashboard with stats and recent submissions
- [x] Full CRUD for: Services, Products, Insights, Case Studies, Testimonials, Team, Partners, Job Openings
- [x] Client inquiry management
- [x] Job application management
- [x] Search & filter on all admin data tables
- [x] Auto-generate slugs with duplicate validation
- [x] Image upload via Supabase Storage

### Forms & Submissions
- [x] Contact page dual forms (client inquiry + job application)
- [x] Careers page with job openings from DB + application form
- [x] Form validation and success/error handling

### SEO (Completed 9 Feb)
- [x] `robots.txt` — blocks `/admin/`, `/api/`, points to sitemap
- [x] `sitemap.xml` — dynamic, fetches all published slugs from Supabase
- [x] `metadataBase` + title template (`%s | IILIKA GROUPS`)
- [x] Meta descriptions on every page (static + dynamic from DB seo fields)
- [x] OpenGraph tags (global defaults + per-page with images)
- [x] Twitter Cards (global + per-page)
- [x] JSON-LD Organization schema (root layout)
- [x] JSON-LD WebSite schema (home page)
- [x] JSON-LD Service schema (GCC, Staffing, Projects pages)
- [x] JSON-LD BlogPosting schema (insights/[slug])
- [x] OG image (`iilika-groups-large.png` 1200x630)
- [x] Admin pages noindex/nofollow

### Database (Supabase)
- [x] Tables: services, products, insights, case_studies, testimonials, team_members, partner_logos, job_openings, client_inquiries, general_applications, admin_profiles
- [x] SEO fields (seo_title, seo_description) on products, insights, case_studies, services
- [x] Server-side + client-side Supabase setup
- [x] Auth middleware for admin routes

---

## Pending — Immediate (This Week)

### 1. Content Population
- [ ] Add 4-5 testimonials with company logos via admin
- [ ] Add 2-3 team members (mark at least 1 as author for insights)
- [ ] Add 5-6 partner/client logos
- [ ] Add 1-2 case studies with real content
- [ ] Add 1-2 blog posts (insights)
- [ ] Add sub-services under each pillar (optional)

### 2. Dynamic Content on Home Page
- [ ] Fetch featured case studies on home page (`case_studies` where featured=true)
- [ ] Fetch featured products on home page (`products` where featured=true)
- [ ] Fetch service offerings on services page from DB (`services` table)

### 3. Uncommitted Changes
- [ ] Review and commit all current changes (SEO, carousel fixes, button updates, services/[slug])

---

## Pending — Short-term (Next 1-2 Weeks)

### 4. UI/UX Improvements
- [ ] Add loading skeletons for data fetching on dynamic pages
- [ ] Add empty state components when no content exists
- [ ] Improve mobile responsiveness of admin panel
- [ ] Add breadcrumbs to admin pages

### 5. Admin Panel Enhancements
- [ ] Pagination for large datasets
- [ ] Bulk status update (select multiple items, change status)
- [ ] "Duplicate" action for content items
- [ ] Image preview in data tables
- [ ] Verify seo_title/seo_description fields are visible and editable in all admin CRUD forms

### 6. Deployment
- [ ] Add environment variables to Vercel
- [ ] Test all forms in production
- [ ] Verify RLS policies work correctly
- [ ] Check all images load from Supabase Storage
- [ ] Test admin login in production
- [ ] Set up custom domain (iilikagroups.com)
- [ ] Review Supabase usage limits

---

## Pending — Medium-term (Phase 2)

### 7. SEO Phase 2
- [ ] Dynamic OG image generation using next/og ImageResponse API
- [ ] Explicit canonical URLs (`alternates.canonical`) on slug pages
- [ ] JSON-LD Article schema on `/case-studies/[slug]`
- [ ] JSON-LD JobPosting schema on `/careers` (requires refactoring from client to server component)
- [ ] BreadcrumbList JSON-LD schema
- [ ] Favicon set (apple-touch-icon, PNG favicons for broader compatibility)
- [ ] `manifest.json` (PWA support)

### 8. Role-Based Access Control (RBAC)
- [ ] HR role — access to careers/applications only
- [ ] Sales role — access to client inquiries only
- [ ] Update sidebar to show/hide sections based on role
- [ ] Update Supabase RLS policies for role-based access

### 9. Email Notifications
- [ ] Set up Brevo (or alternative) for transactional emails
- [ ] Send email to admin on new client inquiry
- [ ] Send email to admin on new job application
- [ ] Send confirmation email to applicants

---

## Pending — Long-term (Phase 3)

### 10. Quick Quote Calculator
- [ ] Design calculator UI (roles x duration x seniority)
- [ ] Implement client-side calculation
- [ ] Create quote request form
- [ ] Store quote requests in database
- [ ] Add quote management to admin panel

### 11. Analytics & Reporting
- [ ] Dashboard charts (inquiries over time, applications by role)
- [ ] Export data to CSV/PDF
- [ ] Conversion tracking (inquiry -> qualified -> closed)

### 12. Performance & Optimization
- [ ] Image optimization strategy (next/image with Supabase URLs)
- [ ] Implement caching strategy (reduce force-dynamic where possible)
- [ ] Add error boundaries
- [ ] Set up error monitoring (Sentry or similar)

---

## Post-Launch
- [ ] Monitor error logs
- [ ] Check Supabase dashboard for usage
- [ ] Submit sitemap to Google Search Console
- [ ] Verify OG tags with Facebook Sharing Debugger / opengraph.xyz
- [ ] Test JSON-LD with Google Rich Results Test
- [ ] Gather feedback and iterate

---

## Quick Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Generate Supabase types (optional)
npx supabase gen types typescript --project-id jaovrulsgiszvpfgyqzm > src/types/database.ts
```

---

## Useful Links

- **Admin Panel**: http://localhost:3000/admin
- **Supabase Dashboard**: https://supabase.com/dashboard/project/jaovrulsgiszvpfgyqzm
- **Supabase Table Editor**: https://supabase.com/dashboard/project/jaovrulsgiszvpfgyqzm/editor
- **Supabase Storage**: https://supabase.com/dashboard/project/jaovrulsgiszvpfgyqzm/storage/buckets
- **Google Rich Results Test**: https://search.google.com/test/rich-results
- **OG Tag Validator**: https://www.opengraph.xyz

---

*Created: 9 February 2026*
*Previous roadmap: TODO_24jan.md*
