import Button from "@/components/ui/Button";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import Link from "next/link";
import CaseStudiesGrid from "@/components/case-studies/CaseStudiesGrid";

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
              Real results from real partnerships. See how we&apos;ve helped enterprises succeed.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-custom">
          <CaseStudiesGrid caseStudies={(caseStudies as CaseStudy[]) || []} />
        </div>
      </section>

      <section className="bg-[#333333] text-white py-16">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to be our next success story?</h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Let&apos;s discuss how we can help transform your business with the right talent and solutions.
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
