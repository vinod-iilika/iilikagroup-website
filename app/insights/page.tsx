import { createServerSupabaseClient } from "@/lib/supabase-server";
import InsightsGrid from "@/components/insights/InsightsGrid";

// Disable caching to always fetch fresh data
export const dynamic = "force-dynamic";

interface Author {
  name: string;
  photo_url?: string;
}

interface InsightRaw {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  tags: string[];
  cover_image_url?: string;
  created_at: string;
  author: Author[] | null;
}

interface Insight {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  tags: string[];
  cover_image_url?: string;
  created_at: string;
  author: Author | null;
}

export const metadata = {
  title: "Insights",
  description:
    "Expert insights on IT staffing, GCC enablement, and technology trends from IILIKA GROUPS.",
};

export default async function InsightsPage() {
  const supabase = await createServerSupabaseClient();

  const { data: rawInsights } = await supabase
    .from("insights")
    .select(`
      id,
      slug,
      title,
      excerpt,
      tags,
      cover_image_url,
      created_at,
      author:team_members(name, photo_url)
    `)
    .eq("status", "published")
    .order("created_at", { ascending: false });

  // Transform the data to flatten the author array
  const insights: Insight[] = rawInsights?.map((item: InsightRaw) => ({
    ...item,
    author: Array.isArray(item.author) && item.author.length > 0 ? item.author[0] : null,
  })) || [];

  return (
    <>
      <section className="bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">Insights</h1>
            <p className="text-xl text-[#333333] leading-relaxed">
              Expert perspectives on IT staffing, GCC enablement, and technology trends
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-custom">
          <InsightsGrid insights={insights} />
        </div>
      </section>
    </>
  );
}
