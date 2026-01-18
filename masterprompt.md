```markdown
# 🎯 IILIKA GROUPS Website Master Development Plan

## 📋 Project Overview
**Company**: IILIKA GROUPS (iilikagroups.com)  
**Positioning**: IT Staffing + GCC Enablement + Service-based Project Delivery  
**Location**: Lohegaon, Pune, India  
**Tech Stack**: React + TypeScript + Tailwind + Supabase + Vercel  
**Design Inspiration**: ABB.com (clean industrial B2B design)  
**Current State**: Single landing page → Full multi-page B2B lead gen site  

---

## 🎨 Design System (4 Colors Only)

| Color | HEX | Usage |
|-------|-----|-------|
| **Primary Red** | `#E30613` | CTAs, accents, highlights |
| **Dark Grey** | `#333333` | Headings, borders, icons |
| **Black** | `#000000` | Body text, headlines |
| **White** | `#FFFFFF` | Backgrounds, cards |

**Typography**: Modern sans-serif (Inter/Source Sans 3/IBM Plex Sans)
- H1: 44–56px bold
- H2: 28–32px semi-bold  
- H3: 20–22px
- Body: 16–18px (150–170% line height)

**Layout**: ABB-style strong grid, generous whitespace, card-based content bands, left-aligned text.

---

## 🏗️ Page Structure (7 Core Pages)

| Page | Purpose | Key Features |
|------|---------|-------------|
| **Home** | Overview + teasers | Hero (video), 3 pillars, testimonials, case studies teaser |
| **About** | Credibility | Story, experience, values, locations |
| **Services** | Service overview | 3 pillars → GCC/Projects pages |
| **GCC Enablement** | GCC deep dive | Setup process, models, metrics |
| **Service-based Projects** | Project delivery | Engagement models, tech stacks |
| **Careers** | Job openings | Dynamic Supabase openings + single form |
| **Contact** | Dual audience | Toggle: Client form / Applicant form |

**Navigation**: Home, About, Services, GCC, Projects, Careers, Contact

---

## 🚀 Hero Section (Keep Video)
```
Layout: Video (right) + Text block (left on white)
Headline: "Building teams and GCCs that deliver."
Sub: "Staffing, GCC enablement, project delivery for modern enterprises."
Bullets:
-  Deployed staffing & IT hiring
-  GCC setup & scaling  
-  Project-based delivery
CTA: Red "Explore services"
```

---

## 💼 Service Pillars (3 Core Offerings)

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

## 🛠️ Supabase Backend Schema

### Core Tables
```sql
services (slug, title, description, category)
careers_openings (title, slug, location, experience, tech_stack[], status)
```

### Priority Features Tables
```sql
testimonials (client_name, quote, logo_url, status)
case_studies (slug, title, challenge, solution, results[], status)
insights (slug, title, content, category, status)
```

**RLS**: Public read (active/published), admin write.

---

## ✨ Priority Features (4 Selected)

### 1. Testimonials Carousel (Week 1)
- Home + Services pages
- Auto-scrolling ABB-style cards

### 2. Case Studies (Week 2)
- `/case-studies` + Home teasers
- Challenge → Solution → Results format

### 3. Insights Blog (Week 3)
- `/insights` + category filters
- GCC trends, staffing tips, tech insights

### 4. Quick Quote Calculator (Week 4)
- Client-side JS: #roles × duration × seniority
- "Get exact quote" → prefilled form

---

## 📱 Forms Strategy

**Contact Page** (toggleable):
```
[For Clients] [For Applicants]
Client: Company, Service type, Message
Applicant: Name, Role, LinkedIn/CV, Message
```

**Careers Page** (single form):
```
Name, Email, Interested role (dropdown), CV upload
```

---

## 🧪 Implementation Roadmap (4 Weeks)

| Week | Deliverables | Supabase | Pages |
|------|-------------|----------|-------|
| **1** | Core 7 pages + Testimonials | `testimonials` | All |
| **2** | Services/GCC/Projects + Case Studies | `case_studies` | Services subpages |
| **3** | Careers (dynamic) + Insights | `careers_openings`, `insights` | Careers, `/insights` |
| **4** | Quote calculator + Admin CMS | None | Home/Services |

---

## ⚙️ Admin Dashboard (/admin)
- Manage: Services, Careers openings, Case studies, Testimonials, Insights
- CRUD + status toggle (active/published/draft)

---

## 🎯 Success Metrics
- [ ] 7 pages live
- [ ] Dynamic careers (5+ openings)
- [ ] 3 case studies
- [ ] 8 testimonials
- [ ] 5 insights posts
- [ ] Quote calculator generating leads
- [ ] Forms capturing client/applicant leads

---

## 📝 Next Immediate Actions
1. **Create Supabase tables** (services, careers_openings, testimonials)
2. **Build Hero component** (video + ABB copy)
3. **Testimonials carousel** (Priority #1)
4. **Careers page** (dynamic from Supabase)

**Copy this entire plan to your project README.md**
```

This master plan captures **everything** from our discussion: colors, pages, services, Supabase schema, features, roadmap. Copy-paste it directly into your GitHub repo README and start building from Hero → Testimonials → Careers. [perplexity](https://www.perplexity.ai/hub/blog/building-safer-ai-browsers-with-browsesafe)