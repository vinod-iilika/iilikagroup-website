import { createServerSupabaseClient } from "@/lib/supabase-server";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Button from "@/components/ui/Button";

interface CaseStudyPageProps {
  params: Promise<{ slug: string }>;
}

interface CaseStudy {
  id: string;
  slug: string;
  title: string;
  client_name?: string;
  industry?: string;
  challenge: string;
  solution: string;
  results: string[];
  technologies: string[];
  thumbnail_url?: string;
  seo_title?: string;
  seo_description?: string;
}

export async function generateMetadata({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: caseStudy } = await supabase
    .from("case_studies")
    .select("title, client_name, seo_title, seo_description")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!caseStudy) {
    return { title: "Case Study Not Found | IILIKA GROUPS" };
  }

  return {
    title: caseStudy.seo_title || `${caseStudy.title} | IILIKA GROUPS`,
    description: caseStudy.seo_description || `Case study: ${caseStudy.title}${caseStudy.client_name ? ` for ${caseStudy.client_name}` : ""}`,
  };
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: caseStudy } = await supabase
    .from("case_studies")
    .select(`
      id,
      slug,
      title,
      client_name,
      industry,
      challenge,
      solution,
      results,
      technologies,
      thumbnail_url,
      seo_title,
      seo_description
    `)
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!caseStudy) {
    notFound();
  }

  const typedCaseStudy = caseStudy as CaseStudy;

  // Simple markdown-like rendering
  const renderContent = (content: string) => {
    return content.split("\n\n").map((paragraph, index) => {
      if (paragraph.startsWith("### ")) {
        return (
          <h3 key={index} className="text-xl font-semibold text-black mt-6 mb-3">
            {paragraph.replace("### ", "")}
          </h3>
        );
      }
      if (paragraph.startsWith("## ")) {
        return (
          <h2 key={index} className="text-2xl font-bold text-black mt-8 mb-4">
            {paragraph.replace("## ", "")}
          </h2>
        );
      }
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
      return (
        <p key={index} className="text-[#333333] leading-relaxed mb-4">
          {paragraph}
        </p>
      );
    });
  };

  return (
    <>
      <article className="bg-white">
        {/* Header */}
        <section className="bg-gradient-to-b from-gray-50 to-white py-16">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <Link
                href="/case-studies"
                className="inline-flex items-center text-[#FF000E] hover:underline mb-6"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Case Studies
              </Link>

              <div className="flex flex-wrap gap-2 mb-4">
                {typedCaseStudy.industry && (
                  <span className="text-sm px-3 py-1 bg-[#FF000E]/10 text-[#FF000E] rounded-full">
                    {typedCaseStudy.industry}
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-4">
                {typedCaseStudy.title}
              </h1>

              {typedCaseStudy.client_name && (
                <p className="text-xl text-[#333333]">
                  Client: {typedCaseStudy.client_name}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Thumbnail */}
        {typedCaseStudy.thumbnail_url && (
          <section className="container-custom py-8">
            <div className="max-w-4xl mx-auto">
              <div className="relative aspect-video rounded-lg overflow-hidden">
                <Image
                  src={typedCaseStudy.thumbnail_url}
                  alt={typedCaseStudy.title}
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
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main content */}
              <div className="lg:col-span-2">
                {/* Challenge */}
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-3">
                    <span className="w-10 h-10 rounded-full bg-[#FF000E] text-white flex items-center justify-center text-lg font-bold">
                      1
                    </span>
                    The Challenge
                  </h2>
                  <div className="pl-13">{renderContent(typedCaseStudy.challenge)}</div>
                </div>

                {/* Solution */}
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-3">
                    <span className="w-10 h-10 rounded-full bg-[#FF000E] text-white flex items-center justify-center text-lg font-bold">
                      2
                    </span>
                    Our Solution
                  </h2>
                  <div className="pl-13">{renderContent(typedCaseStudy.solution)}</div>
                </div>

                {/* Results */}
                {typedCaseStudy.results && typedCaseStudy.results.length > 0 && (
                  <div className="mb-12">
                    <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-3">
                      <span className="w-10 h-10 rounded-full bg-[#FF000E] text-white flex items-center justify-center text-lg font-bold">
                        3
                      </span>
                      The Results
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                      {typedCaseStudy.results.map((result, index) => (
                        <div
                          key={index}
                          className="bg-gray-50 rounded-lg p-4 flex items-start gap-3"
                        >
                          <svg className="w-6 h-6 text-[#FF000E] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-[#333333]">{result}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-8 bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-black mb-4">Project Details</h3>

                  {typedCaseStudy.client_name && (
                    <div className="mb-4">
                      <p className="text-sm text-[#333333]">Client</p>
                      <p className="font-medium text-black">{typedCaseStudy.client_name}</p>
                    </div>
                  )}

                  {typedCaseStudy.industry && (
                    <div className="mb-4">
                      <p className="text-sm text-[#333333]">Industry</p>
                      <p className="font-medium text-black">{typedCaseStudy.industry}</p>
                    </div>
                  )}

                  {typedCaseStudy.technologies && typedCaseStudy.technologies.length > 0 && (
                    <div className="mb-6">
                      <p className="text-sm text-[#333333] mb-2">Technologies</p>
                      <div className="flex flex-wrap gap-2">
                        {typedCaseStudy.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="text-xs px-2 py-1 bg-white text-[#333333] rounded border border-gray-200"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <Link href="/contact" className="block">
                    <Button variant="primary" className="w-full">
                      Discuss Your Project
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#333333] text-white py-16">
          <div className="container-custom text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to achieve similar results?
            </h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Let's discuss how we can help transform your business with the right talent and solutions.
            </p>
            <Link href="/contact">
              <Button variant="primary">Get Started</Button>
            </Link>
          </div>
        </section>
      </article>
    </>
  );
}
