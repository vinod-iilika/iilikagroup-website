# Quick Start Guide - IILIKA GROUPS Website

Get your website running in 5 minutes!

## Step 1: Install Dependencies (1 min)

```bash
npm install
```

## Step 2: Run Development Server (30 seconds)

```bash
npm run dev
```

Visit **http://localhost:3000** in your browser.

## Step 3: View Your Website

You should see:
- ✅ Hero section with video placeholder
- ✅ Three service pillars
- ✅ Company statistics
- ✅ Testimonials carousel (auto-scrolling)
- ✅ Full navigation working
- ✅ All 7 pages accessible

## What Works Right Now (Without Supabase)

- ✅ **All pages load and look great**
- ✅ **Responsive design** (try resizing your browser)
- ✅ **Navigation menu** (including mobile hamburger)
- ✅ **Testimonials carousel** (with hardcoded data)
- ✅ **All forms render** (need backend to submit)
- ✅ **Career listings** (with hardcoded jobs)

## What You Need to Do Next

### To Make Forms Functional
1. Follow `SUPABASE_SETUP.md` to set up database
2. Connect forms to Supabase
3. Set up email notifications

### To Make Content Dynamic
1. Set up Supabase (see `SUPABASE_SETUP.md`)
2. Create `.env.local` with your credentials
3. Install Supabase client: `npm install @supabase/supabase-js`
4. Create `lib/supabase.ts` (instructions in SUPABASE_SETUP.md)

### To Add Your Branding
1. **Logo**: Update "IILIKA GROUPS" text in `components/layout/Header.tsx`
2. **Hero Video**: Replace placeholder in `components/Hero.tsx`
3. **Contact Info**: Update email/phone in `components/layout/Footer.tsx` and `app/contact/page.tsx`
4. **Company Info**: Update text in `app/about/page.tsx`

## File Structure Quick Reference

```
📁 app/               → All pages (Home, About, Services, etc.)
📁 components/        → Reusable UI components
  ├── layout/         → Header, Footer
  ├── ui/             → Button, Card
  └── Hero.tsx        → Hero section
📁 public/            → Static files (add images/videos here)
📄 tailwind.config.ts → Design system colors
```

## Key URLs to Know

- **Homepage**: http://localhost:3000
- **About**: http://localhost:3000/about
- **Services**: http://localhost:3000/services
- **GCC**: http://localhost:3000/gcc-enablement
- **Projects**: http://localhost:3000/service-based-projects
- **Careers**: http://localhost:3000/careers
- **Contact**: http://localhost:3000/contact

## Testing Checklist

- [ ] Homepage loads with Hero section
- [ ] Navigation menu works (all 7 links)
- [ ] Mobile menu opens/closes (resize to mobile)
- [ ] Testimonials carousel auto-scrolls
- [ ] Contact page toggle works (Client/Applicant)
- [ ] All pages are responsive
- [ ] Footer shows on all pages

## Build for Production

When ready to deploy:

```bash
npm run build
npm start
```

## Deploy to Vercel

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables (when you set up Supabase)
5. Deploy!

## Need Help?

- Check `README.md` for full documentation
- See `SUPABASE_SETUP.md` for database setup
- Read `PROJECT_SUMMARY.md` for what's been built
- Review `masterprompt.md` for original requirements

## Common Issues

**Port 3000 already in use?**
```bash
# Kill the process using port 3000, or use a different port:
npm run dev -- -p 3001
```

**TypeScript errors?**
- Restart your IDE/editor
- Run `npm run build` to see detailed errors

**Styles not loading?**
- Make sure Tailwind is configured (`tailwind.config.ts` exists)
- Check `app/globals.css` imports Tailwind directives

---

🎉 **You're all set! Your website is ready to customize and deploy!**
