import type { MetadataRoute } from "next";
import { createServerSupabaseClient } from "@/lib/supabase-server";

const BASE_URL = "https://iilikagroups.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createServerSupabaseClient();

  // Fetch dynamic slugs in parallel
  const [productsRes, insightsRes, caseStudiesRes, servicesRes] =
    await Promise.all([
      supabase
        .from("products")
        .select("slug, updated_at")
        .eq("status", "active"),
      supabase
        .from("insights")
        .select("slug, updated_at")
        .eq("status", "published"),
      supabase
        .from("case_studies")
        .select("slug, updated_at")
        .eq("status", "published"),
      supabase
        .from("services")
        .select("slug, updated_at")
        .eq("status", "active"),
    ]);

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/services`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/gcc-enablement`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/staffing`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/service-based-projects`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/products`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/insights`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/case-studies`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/careers`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Dynamic routes
  const productRoutes: MetadataRoute.Sitemap = (productsRes.data ?? []).map(
    (p) => ({
      url: `${BASE_URL}/products/${p.slug}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    })
  );

  const insightRoutes: MetadataRoute.Sitemap = (insightsRes.data ?? []).map(
    (i) => ({
      url: `${BASE_URL}/insights/${i.slug}`,
      lastModified: i.updated_at ? new Date(i.updated_at) : new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    })
  );

  const caseStudyRoutes: MetadataRoute.Sitemap = (
    caseStudiesRes.data ?? []
  ).map((c) => ({
    url: `${BASE_URL}/case-studies/${c.slug}`,
    lastModified: c.updated_at ? new Date(c.updated_at) : new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const serviceRoutes: MetadataRoute.Sitemap = (servicesRes.data ?? []).map(
    (s) => ({
      url: `${BASE_URL}/services/${s.slug}`,
      lastModified: s.updated_at ? new Date(s.updated_at) : new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    })
  );

  return [
    ...staticRoutes,
    ...productRoutes,
    ...insightRoutes,
    ...caseStudyRoutes,
    ...serviceRoutes,
  ];
}
