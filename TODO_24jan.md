# IILIKA GROUPS - Next Course of Action (24 Jan 2026)

## Immediate Tasks (This Week)

### 1. Connect Frontend Forms to Supabase
- [x] Update Contact page client form to submit to `client_inquiries` table
- [x] Update Contact page applicant form to submit to `general_applications` table
- [x] Add success/error toast notifications on form submission
- [x] Add form validation (email format, required fields)

### 2. Fetch & Display Dynamic Content on Public Pages

| Page | Content to Fetch | Table | Status |
|------|------------------|-------|--------|
| Home | Testimonials carousel | `testimonials` | ✅ Done |
| Home | Featured case studies | `case_studies` (featured=true) | Pending |
| Home | Featured products | `products` (featured=true) | Pending |
| About | Team members | `team_members` | ✅ Done |
| About | Partner logos | `partner_logos` | ✅ Done |
| Services | Service pillars + offerings | `services` | Pending |

### 3. Add Sample Content via Admin Panel
- [ ] Add 4-5 testimonials with company logos
- [ ] Add 2-3 team members (mark at least 1 as author)
- [ ] Add 5-6 partner/client logos
- [ ] Add 1-2 case studies
- [ ] Add 1 blog post (insight)
- [ ] Add sub-services under each pillar (optional)

### 4. Create Dynamic Pages
- [x] `/insights` - Blog listing page
- [x] `/insights/[slug]` - Individual blog post page
- [x] `/case-studies` - Case studies listing page
- [x] `/case-studies/[slug]` - Individual case study page
- [x] `/products` - Products showcase page
- [x] `/products/[slug]` - Individual product page

---

## Short-term Tasks (Next 1-2 Weeks)

### 5. SEO & Meta Tags
- [ ] Add dynamic meta tags to content pages using SEO fields from database
- [ ] Generate JSON-LD schema for blog posts
- [ ] Add Open Graph tags for social sharing
- [ ] Create sitemap.xml

### 6. UI/UX Improvements
- [ ] Add loading skeletons for data fetching
- [ ] Add empty state components when no content
- [ ] Improve mobile responsiveness of admin panel
- [ ] Add breadcrumbs to admin pages

### 7. Admin Panel Enhancements
- [ ] Add search/filter to data tables
- [ ] Add pagination for large datasets
- [ ] Add bulk status update (select multiple → change status)
- [ ] Add "duplicate" action for content items
- [ ] Show image preview in data tables

---

## Medium-term Tasks (Phase 2)

### 8. Careers Module
- [ ] Design job application workflow (statuses, notifications)
- [ ] Create `careers_openings` table schema
- [ ] Create `job_applications` table schema
- [ ] Build Careers admin pages (openings CRUD)
- [ ] Build job applications management page
- [ ] Update public Careers page to fetch from database
- [ ] Create job application form

### 9. Role-Based Access Control (RBAC)
- [ ] Add HR role - access to careers/applications only
- [ ] Add Sales role - access to client inquiries only
- [ ] Update sidebar to show/hide based on role
- [ ] Update RLS policies for role-based access

### 10. Email Notifications
- [ ] Set up Brevo (or alternative) for transactional emails
- [ ] Send email on new client inquiry
- [ ] Send email on new job application
- [ ] Send confirmation email to applicants

---

## Long-term Tasks (Phase 3)

### 11. Quick Quote Calculator
- [ ] Design calculator UI (roles × duration × seniority)
- [ ] Implement client-side calculation
- [ ] Create quote request form
- [ ] Store quote requests in database
- [ ] Add to admin panel

### 12. Analytics & Reporting
- [ ] Dashboard charts (inquiries over time, applications by role)
- [ ] Export data to CSV
- [ ] Conversion tracking (inquiry → qualified → closed)

### 13. Performance & Optimization
- [ ] Image optimization (next/image with Supabase URLs)
- [ ] Implement caching strategy
- [ ] Add error boundaries
- [ ] Set up error monitoring (Sentry or similar)

---

## Deployment Checklist

### Before Going Live
- [ ] Add environment variables to Vercel
- [ ] Test all forms in production
- [ ] Verify RLS policies work correctly
- [ ] Check all images load from Supabase Storage
- [ ] Test admin login in production
- [ ] Set up custom domain
- [ ] Enable Supabase email confirmations (if needed)
- [ ] Review Supabase usage limits

### Post-Launch
- [ ] Monitor error logs
- [ ] Check Supabase dashboard for usage
- [ ] Gather feedback and iterate

---

## Priority Order

```
Week 1:
├── Connect contact forms to Supabase
├── Add sample content via admin
└── Fetch testimonials on homepage

Week 2:
├── Create /insights and /case-studies pages
├── Fetch team members on About page
└── Add SEO meta tags

Week 3:
├── Deploy to Vercel
├── Test in production
└── Start careers module design

Week 4+:
├── Build careers module
├── Add RBAC
└── Email notifications
```

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

---

*Created: 24 January 2026*
