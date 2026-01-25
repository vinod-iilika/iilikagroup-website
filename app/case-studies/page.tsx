import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import Image from "next/image";
import Link from "next/link";

// Disable caching to always fetch fresh data
export const dynamic = "force-dynamic";

interface CaseStudy {
  id: string;
  slug: string;
  title: string;
  client_name?: string;
  industry?: string;
  challenge: string;
  results: string[];
  technologies: string[];
  thumbnail_url?: string;
}

export const metadata = {
  title: "Case Studies | IILIKA GROUPS",
  description: "Explore how IILIKA GROUPS has helped enterprises with IT staffing, GCC enablement, and project delivery.",
};

export default async function CaseStudiesPage() {
  const supabase = await createServerSupabaseClient();

  const { data: caseStudies } = await supabase
    .from("case_studies")
    .select(`
      id,
      slug,
      title,
      client_name,
      industry,
      challenge,
      results,
      technologies,
      thumbnail_url
    `)
    .eq("status", "published")
    .order("created_at", { ascending: false });

  return (
    <>
      <section className="bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">Case Studies</h1>
            <p className="text-xl text-[#333333] leading-relaxed">
              Real results from real partnerships. See how we've helped enterprises succeed.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-custom">
          {caseStudies && caseStudies.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {caseStudies.map((study: CaseStudy) => (
                <Card key={study.id} className="flex flex-col h-full">
                  <div className="flex flex-col md:flex-row gap-6">
                    {study.thumbnail_url && (
                      <div className="relative w-full md:w-48 h-32 flex-shrink-0 rounded-lg overflow-hidden">
                        <Image
                          src={study.thumbnail_url}
                          alt={study.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-grow">
                      {study.industry && (
                        <span className="inline-block text-xs px-2 py-1 bg-[#FF000E]/10 text-[#FF000E] rounded mb-2">
                          {study.industry}
                        </span>
                      )}
                      <h2 className="text-xl font-semibold text-black mb-2">
                        {study.title}
                      </h2>
                      {study.client_name && (
                        <p className="text-sm text-[#333333] mb-3">
                          Client: {study.client_name}
                        </p>
                      )}
                    </div>
                  </div>

                  <p className="text-[#333333] mt-4 mb-4 line-clamp-3">
                    {study.challenge}
                  </p>

                  {study.results && study.results.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-black mb-2">Key Results:</p>
                      <ul className="text-sm text-[#333333] space-y-1">
                        {study.results.slice(0, 3).map((result, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <svg className="w-4 h-4 text-[#FF000E] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span>{result}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {study.technologies && study.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {study.technologies.slice(0, 5).map((tech) => (
                        <span
                          key={tech}
                          className="text-xs px-2 py-1 bg-gray-100 text-[#333333] rounded"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  <Link href={`/case-studies/${study.slug}`} className="mt-auto">
                    <Button variant="outline" size="sm" className="w-full">
                      Read Full Case Study
                    </Button>
                  </Link>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-[#333333] mb-4">No case studies published yet.</p>
              <p className="text-[#333333]">Check back soon for client success stories.</p>
            </div>
          )}
        </div>
      </section>

      <section className="bg-[#333333] text-white py-16">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to be our next success story?</h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Let's discuss how we can help transform your business with the right talent and solutions.
          </p>
          <Link href="/contact">
            <Button variant="primary" size="lg">
              Start the Conversation
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
