# IILIKA GROUPS Website

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)]() [![TypeScript](https://img.shields.io/badge/TypeScript-passing-blue)]() [![Vercel](https://img.shields.io/badge/Vercel-ready-black)]()

Modern corporate website for IILIKA GROUPS - IT Staffing, GCC Enablement & Service-based Project Delivery.

**✅ Production build verified - Ready for Vercel deployment**

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase
- **Deployment**: Vercel

## Design System

Based on ABB.com design principles with a clean, industrial B2B aesthetic.

### Colors
- Primary Red: `#FF000E`
- Sangria (Secondary Red): `#9E0008`
- Graphite White: `#A3A3A3`
- Black: `#000000`
- White: `#FFFFFF`

### Typography
- Font: [Montserrat](https://fonts.google.com/specimen/Montserrat)
- Headings: Bold, clean hierarchy
- Body: 16-18px with generous line spacing

## Project Structure

```
├── app/
│   ├── about/
│   ├── services/
│   ├── gcc-enablement/
│   ├── service-based-projects/
│   ├── careers/
│   ├── contact/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── ui/
│   │   ├── Button.tsx
│   │   └── Card.tsx
│   ├── Hero.tsx
│   └── TestimonialsCarousel.tsx
├── lib/
├── types/
└── public/
```

## Getting Started

### Prerequisites
- Node.js 18+ installed
- A Supabase account

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```

3. Update `.env.local` with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Supabase Setup

Follow the guide in the next section to set up your Supabase tables and database.

## Pages

1. **Home** (`/`) - Hero section, services overview, stats, testimonials
2. **About** (`/about`) - Company story, values, location
3. **Services** (`/services`) - Overview of all three service pillars
4. **GCC Enablement** (`/gcc-enablement`) - Detailed GCC services
5. **Service-based Projects** (`/service-based-projects`) - Project delivery models
6. **Careers** (`/careers`) - Job openings and application form
7. **Contact** (`/contact`) - Dual forms for clients and applicants

## Features (Week 1)

- ✅ Responsive design with mobile-first approach
- ✅ ABB-inspired clean, industrial aesthetic
- ✅ Hero section with video placeholder
- ✅ 7 core pages with complete content
- ✅ Testimonials carousel with auto-scroll
- ✅ Contact forms (client/applicant toggle)
- ✅ Careers page with job listings

## Deployment

Deploy to Vercel:

```bash
npm run build
```

Then push to your Git repository and connect to Vercel.

## License

Copyright © 2026 IILIKA GROUPS. All rights reserved.
