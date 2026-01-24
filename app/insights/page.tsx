import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import Image from "next/image";
import Link from "next/link";

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
  title: "Insights | IILIKA GROUPS",
  description: "Expert insights on IT staffing, GCC enablement, and technology trends from IILIKA GROUPS.",
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
  const insights: Insight[] | null = rawInsights?.map((item: InsightRaw) => ({
    ...item,
    author: Array.isArray(item.author) && item.author.length > 0 ? item.author[0] : null,
  })) || null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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
          {insights && insights.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {insights.map((insight: Insight) => (
                <Card key={insight.id} className="flex flex-col h-full">
                  {insight.cover_image_url && (
                    <div className="relative h-48 -mx-6 -mt-6 mb-6 overflow-hidden rounded-t-lg">
                      <Image
                        src={insight.cover_image_url}
                        alt={insight.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  {insight.tags && insight.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {insight.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-1 bg-gray-100 text-[#333333] rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <h2 className="text-xl font-semibold text-black mb-3 line-clamp-2">
                    {insight.title}
                  </h2>

                  {insight.excerpt && (
                    <p className="text-[#333333] mb-4 line-clamp-3 flex-grow">
                      {insight.excerpt}
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      {insight.author?.photo_url ? (
                        <div className="relative w-8 h-8 rounded-full overflow-hidden">
                          <Image
                            src={insight.author.photo_url}
                            alt={insight.author.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-[#FF000E] flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            {insight.author?.name?.charAt(0) || "I"}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-black">
                          {insight.author?.name || "IILIKA GROUPS"}
                        </p>
                        <p className="text-xs text-[#333333]">
                          {formatDate(insight.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Link href={`/insights/${insight.slug}`} className="mt-4">
                    <Button variant="outline" size="sm" className="w-full">
                      Read More
                    </Button>
                  </Link>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-[#333333] mb-4">No insights published yet.</p>
              <p className="text-[#333333]">Check back soon for expert articles and industry perspectives.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
