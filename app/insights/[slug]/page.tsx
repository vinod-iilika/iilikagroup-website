import { createServerSupabaseClient } from "@/lib/supabase-server";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Button from "@/components/ui/Button";
import { JsonLd } from "@/components/JsonLd";

// Disable caching to always fetch fresh data
export const dynamic = "force-dynamic";

interface InsightPageProps {
  params: Promise<{ slug: string }>;
}

interface Author {
  name: string;
  position?: string;
  photo_url?: string;
  linkedin_url?: string;
}

interface Insight {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  content: string;
  tags: string[];
  cover_image_url?: string;
  created_at: string;
  seo_title?: string;
  seo_description?: string;
  author: Author | null;
}

export async function generateMetadata({ params }: InsightPageProps) {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: insight } = await supabase
    .from("insights")
    .select("title, excerpt, seo_title, seo_description, cover_image_url")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!insight) {
    return { title: "Insight Not Found" };
  }

  const title = insight.seo_title || insight.title;
  const description = insight.seo_description || insight.excerpt;

  return {
    title,
    description,
    openGraph: {
      title,
      description: description || undefined,
      type: "article",
      ...(insight.cover_image_url && {
        images: [{ url: insight.cover_image_url }],
      }),
    },
    twitter: {
      card: insight.cover_image_url
        ? ("summary_large_image" as const)
        : ("summary" as const),
      title,
      description: description || undefined,
      ...(insight.cover_image_url && { images: [insight.cover_image_url] }),
    },
  };
}

export default async function InsightPage({ params }: InsightPageProps) {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: insight } = await supabase
    .from("insights")
    .select(`
      id,
      slug,
      title,
      excerpt,
      content,
      tags,
      cover_image_url,
      created_at,
      seo_title,
      seo_description,
      author:team_members(name, position, photo_url, linkedin_url)
    `)
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!insight) {
    notFound();
  }

  // Transform author array to single object
  const typedInsight: Insight = {
    ...insight,
    author: Array.isArray(insight.author) && insight.author.length > 0
      ? insight.author[0] as Author
      : null,
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Simple markdown-like rendering for content
  const renderContent = (content: string) => {
    return content
      .split("\n\n")
      .map((paragraph, index) => {
        // Handle headings
        if (paragraph.startsWith("### ")) {
          return (
            <h3 key={index} className="text-xl font-semibold text-black mt-8 mb-4">
              {paragraph.replace("### ", "")}
            </h3>
          );
        }
        if (paragraph.startsWith("## ")) {
          return (
            <h2 key={index} className="text-2xl font-bold text-black mt-10 mb-4">
              {paragraph.replace("## ", "")}
            </h2>
          );
        }
        if (paragraph.startsWith("# ")) {
          return (
            <h1 key={index} className="text-3xl font-bold text-black mt-12 mb-6">
              {paragraph.replace("# ", "")}
            </h1>
          );
        }
        // Handle lists
        if (paragraph.startsWith("- ")) {
          const items = paragraph.split("\n").filter((line) => line.startsWith("- "));
          return (
            <ul key={index} className="list-disc list-inside space-y-2 my-4 text-[#333333]">
              {items.map((item, i) => (
                <li key={i}>{item.replace("- ", "")}</li>
              ))}
            </ul>
          );
        }
        // Regular paragraphs
        return (
          <p key={index} className="text-[#333333] leading-relaxed mb-4">
            {paragraph}
          </p>
        );
      });
  };

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: typedInsight.title,
          description: typedInsight.excerpt || undefined,
          datePublished: typedInsight.created_at,
          ...(typedInsight.cover_image_url && {
            image: typedInsight.cover_image_url,
          }),
          author: {
            "@type": "Person",
            name: typedInsight.author?.name || "IILIKA GROUPS",
          },
          publisher: {
            "@type": "Organization",
            name: "IILIKA GROUPS",
            url: "https://iilikagroups.com",
          },
        }}
      />
      <article className="bg-white">
        {/* Header */}
        <section className="bg-gradient-to-b from-gray-50 to-white py-16">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto">
              <Link
                href="/insights"
                className="inline-flex items-center text-[#FF000E] hover:underline mb-6"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Insights
              </Link>

              {typedInsight.tags && typedInsight.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {typedInsight.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-3 py-1 bg-[#FF000E]/10 text-[#FF000E] rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-6">
                {typedInsight.title}
              </h1>

              {typedInsight.excerpt && (
                <p className="text-xl text-[#333333] leading-relaxed mb-8">
                  {typedInsight.excerpt}
                </p>
              )}

              {/* Author info */}
              <div className="flex items-center gap-4 pb-8 border-b border-gray-200">
                {typedInsight.author?.photo_url ? (
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <Image
                      src={typedInsight.author.photo_url}
                      alt={typedInsight.author.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#FF000E] flex items-center justify-center">
                    <span className="text-white text-lg font-bold">
                      {typedInsight.author?.name?.charAt(0) || "I"}
                    </span>
                  </div>
                )}
                <div>
                  <p className="font-semibold text-black">
                    {typedInsight.author?.name || "IILIKA GROUPS"}
                  </p>
                  <p className="text-sm text-[#333333]">
                    {typedInsight.author?.position && `${typedInsight.author.position} · `}
                    {formatDate(typedInsight.created_at)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cover Image */}
        {typedInsight.cover_image_url && (
          <section className="container-custom py-8">
            <div className="max-w-4xl mx-auto">
              <div className="relative aspect-video rounded-lg overflow-hidden">
                <Image
                  src={typedInsight.cover_image_url}
                  alt={typedInsight.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </section>
        )}

        {/* Content */}
        <section className="container-custom py-8">
          <div className="max-w-3xl mx-auto prose prose-lg">
            {renderContent(typedInsight.content)}
          </div>
        </section>

        {/* Author bio */}
        {typedInsight.author && (
          <section className="container-custom py-8">
            <div className="max-w-3xl mx-auto">
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  {typedInsight.author.photo_url ? (
                    <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={typedInsight.author.photo_url}
                        alt={typedInsight.author.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-[#FF000E] flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-2xl font-bold">
                        {typedInsight.author.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-black text-lg">{typedInsight.author.name}</p>
                    {typedInsight.author.position && (
                      <p className="text-[#333333] mb-2">{typedInsight.author.position}</p>
                    )}
                    {typedInsight.author.linkedin_url && (
                      <a
                        href={typedInsight.author.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-[#0077B5] hover:underline text-sm"
                      >
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                        Connect on LinkedIn
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="bg-gray-50 py-16">
          <div className="container-custom text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-black mb-4">
              Want to learn more?
            </h2>
            <p className="text-[#333333] mb-6 max-w-2xl mx-auto">
              Get in touch with our team to discuss how we can help with your staffing, GCC, or project needs.
            </p>
            <Link href="/contact">
              <Button variant="primary">Contact Us</Button>
            </Link>
          </div>
        </section>
      </article>
    </>
  );
}
