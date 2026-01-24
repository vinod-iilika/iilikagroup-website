# IILIKA GROUPS Website Master Development Plan

## Project Overview

**Company**: IILIKA GROUPS (iilikagroups.com)
**Positioning**: IT Staffing + GCC Enablement + Service-based Project Delivery
**Location**: Lohegaon, Pune, India
**Tech Stack**: React + TypeScript + Tailwind + Supabase + Vercel
**Design Inspiration**: ABB.com (clean industrial B2B design)
**Current State**: Frontend base complete → Backend + Admin Panel

---

## Design System (4 Colors Only)

| Color | HEX | Usage |
|-------|-----|-------|
| **Primary Red** | `#E30613` | CTAs, accents, highlights |
| **Dark Grey** | `#333333` | Headings, borders, icons |
| **Black** | `#000000` | Body text, headlines |
| **White** | `#FFFFFF` | Backgrounds, cards |

**Typography**: Montserrat (Primary), fallback to system sans-serif
- H1: 44–56px bold
- H2: 28–32px semi-bold
- H3: 20–22px
- Body: 16–18px (150–170% line height)

**Layout**: ABB-style strong grid, generous whitespace, card-based content bands, left-aligned text.

---

## Page Structure (7 Core Pages)

| Page | Purpose | Key Features |
|------|---------|-------------|
| **Home** | Overview + teasers | Hero (video), 3 pillars, testimonials, case studies teaser, featured products |
| **About** | Credibility | Story, team members, values, locations, partner logos |
| **Services** | Service overview | 3 pillars → GCC/Projects pages |
| **GCC Enablement** | GCC deep dive | Setup process, models, metrics |
| **Service-based Projects** | Project delivery | Engagement models, tech stacks |
| **Careers** | Job openings | Dynamic Supabase openings + single form (Phase 2) |
| **Contact** | Dual audience | Toggle: Client form / Applicant form |

**Additional Pages**:
- `/products` - Product showcase listing
- `/products/[slug]` - Individual product pages
- `/insights` - Blog/articles listing
- `/insights/[slug]` - Individual blog posts
- `/case-studies` - Case studies listing
- `/case-studies/[slug]` - Individual case study pages
- `/admin` - Admin dashboard (protected)

**Navigation**: Home, About, Services, GCC, Projects, Careers, Contact

---

## Hero Section

```
Layout: Video (right) + Text block (left on white)
Headline: "Building teams and GCCs that deliver."
Sub: "Staffing, GCC enablement, project delivery for modern enterprises."
Bullets:
- Deployed staffing & IT hiring
- GCC setup & scaling
- Project-based delivery
CTA: Red "Explore services"
```

---

## Service Pillars (3 Core Offerings)

1. **Staffing & Deployed Resources**
   - Onsite/hybrid/remote engineers
   - Permanent + contract IT hiring

2. **GCC Enablement**
   - GCC setup (talent + infra partners)
   - Scale & transition support

3. **Service-based Project Delivery**
   - Project ownership (like TechM/Wipro)
   - Managed squads/pods
   - Fixed-scope/T&M/retainer

---

## Supabase Backend Schema

### Phase 1 Tables (Current Focus)

#### Content Tables (Admin CRUD)
| Table | Purpose | Status Values |
|-------|---------|---------------|
| `services` | 3 pillars + sub-services | draft, active, archived |
| `products` | Tech/client/partner products | draft, active, archived |
| `insights` | Blog articles (markdown) | draft, published, archived |
| `case_studies` | Client success stories | draft, published, archived |
| `testimonials` | Client quotes carousel | draft, active, archived |
| `team_members` | About page + blog authors | draft, active, archived |
| `partner_logos` | Trust badges/logo strip | active, archived |

#### Submission Tables (Read + Status Update in Admin)
| Table | Purpose | Status Values |
|-------|---------|---------------|
| `client_inquiries` | Contact form - client tab | new, contacted, qualified, closed |
| `general_applications` | Contact form - applicant tab | new, reviewed, shortlisted, closed |

#### System Tables
| Table | Purpose |
|-------|---------|
| `admin_profiles` | Admin user info + roles (linked to auth.users) |

### Phase 2 Tables (Deferred)
| Table | Purpose | Notes |
|-------|---------|-------|
| `careers_openings` | Job listings | Needs workflow design |
| `job_applications` | Applications per job | Linked to careers_openings |

### Key Schema Features
- **Services hierarchy**: Type field (pillar/offering) with parent_id for sub-services
- **Products**: Three types - internal (our products), client (delivered), partner (tools we use)
- **Insights author**: Foreign key to team_members (not free text)
- **SEO fields**: seo_title, seo_description, seo_keywords[] on content pages
- **Featured flag**: On products, case_studies, insights for homepage highlights
- **Soft delete**: Using status = 'archived' (recoverable) + hard delete option

### RLS Policies
- **Public read**: Only active/published content
- **Public write**: client_inquiries and general_applications (insert only)
- **Admin read**: All content regardless of status
- **Admin write**: Full CRUD on all tables

### Storage Buckets
| Bucket | Purpose |
|--------|---------|
| `logos` | Partner/company logos |
| `team` | Team member photos |
| `products` | Product screenshots |
| `insights` | Blog cover images |
| `case-studies` | Case study thumbnails |

**Note**: Resume uploads deferred to Phase 2 (1GB free tier limit). Applicants provide LinkedIn URL instead.

---

## Admin Dashboard (/admin)

### Phase 1 Features
- **Authentication**: Supabase Auth (email/password)
- **Roles**: super_admin, admin (HR, Sales roles in Phase 2)
- **Content Management**:
  - Services (pillars + offerings)
  - Products (CRUD + featured toggle)
  - Insights/Blog (markdown editor)
  - Case Studies (challenge/solution/results)
  - Testimonials (quotes + ordering)
  - Team Members (bios + author flag)
  - Partner Logos (logo carousel management)
- **Submissions** (read-only with status update):
  - Client Inquiries (with admin notes)
  - General Applications (with admin notes)
- **Storage Management**:
  - View uploaded files
  - Orphan file cleanup (manual action)

### Phase 2 Features (Deferred)
- Career openings management
- Job applications workflow
- RBAC (HR sees only careers, Sales sees only inquiries)
- Email notifications (Brevo/SMTP)

---

## Forms Strategy

### Contact Page (toggleable tabs)
```
[For Clients] [For Applicants]

Client Form:
- Company name
- Contact name
- Email, Phone
- Service interest (dropdown: Staffing, GCC, Projects, General Inquiry)
- Message

Applicant Form:
- Name
- Email, Phone
- LinkedIn URL
- Role interest (free text)
- Message
```

### Careers Page (Phase 2)
```
- Name, Email
- Interested role (dropdown from active openings)
- LinkedIn URL
- Message
```

---

## SEO Strategy

### Per-page SEO Fields
- `seo_title` - Custom title tag (falls back to title)
- `seo_description` - Meta description (150-160 chars)
- `seo_keywords[]` - Array for JSON-LD schema

### Applied To
- Services (pillars and offerings)
- Products
- Insights/Blog posts
- Case Studies

---

## Implementation Roadmap

### Phase 1: Backend + Admin (Current)
| Task | Tables | Priority |
|------|--------|----------|
| Supabase schema setup | All Phase 1 tables | High |
| RLS policies | All tables | High |
| Storage buckets | 5 buckets | High |
| Admin authentication | admin_profiles | High |
| Admin CRUD - Content | services, products, insights, case_studies, testimonials, team_members, partner_logos | High |
| Admin - Submissions | client_inquiries, general_applications | Medium |
| Storage management UI | Orphan cleanup | Medium |

### Phase 2: Careers + RBAC
| Task | Tables | Priority |
|------|--------|----------|
| Careers schema design | careers_openings, job_applications | High |
| Application workflow | Status transitions, notifications | Medium |
| RBAC implementation | Role-based access | Medium |
| Email notifications | Brevo/SMTP integration | Low |

### Phase 3: Enhancements
| Task | Notes |
|------|-------|
| Quick Quote Calculator | Client-side estimation → prefilled form |
| Analytics dashboard | Inquiry/application metrics |
| Bulk operations | Multi-select actions in admin |

---

## Success Metrics

### Phase 1 Completion
- [ ] All 10 Phase 1 tables created with RLS
- [ ] Admin login working
- [ ] CRUD for all content types
- [ ] Submissions viewable in admin
- [ ] 3 service pillars seeded
- [ ] Storage buckets configured

### Content Goals
- [ ] 3 case studies published
- [ ] 8 testimonials active
- [ ] 5 insights/blog posts
- [ ] Team members added
- [ ] Partner logos uploaded

### Lead Generation
- [ ] Contact forms capturing inquiries
- [ ] Admin can update submission status
- [ ] Admin notes on each submission

---

## File Structure

```
/supabase
  └── supabase-schema.sql     # Complete SQL schema
/docs
  ├── masterprompt.md         # This file
  └── SUPABASE_SETUP.md       # Setup guide
/src
  ├── lib/
  │   └── supabase.ts         # Supabase client
  ├── types/
  │   └── database.ts         # Generated types
  └── app/
      └── admin/              # Admin panel routes
```

---

## Quick Reference

### Status Values by Table
| Table | Status Options |
|-------|---------------|
| services, products, testimonials, team_members | draft → active → archived |
| insights, case_studies | draft → published → archived |
| partner_logos | active → archived |
| client_inquiries | new → contacted → qualified → closed |
| general_applications | new → reviewed → shortlisted → closed |

### Service Types
- `pillar` - Top-level (Staffing, GCC, Projects)
- `offering` - Sub-service under a pillar

### Product Types
- `internal` - IILIKA's own products
- `client` - Delivered for clients
- `partner` - Partner tools we use/promote

### Partner Logo Types
- `client` - Client company logos
- `partner` - Partner/vendor logos
- `technology` - Tech stack logos
