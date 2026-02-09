import { createServerSupabaseClient } from "@/lib/supabase-server";
import Link from "next/link";
import { notFound } from "next/navigation";
import Button from "@/components/ui/Button";

export const dynamic = "force-dynamic";

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

interface Service {
  id: string;
  slug: string;
  title: string;
  description?: string;
  type: "pillar" | "offering";
  icon_name?: string;
  icon_url?: string;
  seo_title?: string;
  seo_description?: string;
}

export async function generateMetadata({ params }: ServicePageProps) {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: service } = await supabase
    .from("services")
    .select("title, description, seo_title, seo_description")
    .eq("slug", slug)
    .eq("status", "active")
    .single();

  if (!service) {
    return { title: "Service Not Found" };
  }

  const title = service.seo_title || service.title;
  const description =
    service.seo_description || service.description?.slice(0, 160);

  return {
    title,
    description,
    openGraph: {
      title,
      description: description || undefined,
      type: "website",
    },
    twitter: {
      card: "summary" as const,
      title,
      description: description || undefined,
    },
  };
}

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

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: service } = await supabase
    .from("services")
    .select("id, slug, title, description, type, icon_name, icon_url, seo_title, seo_description")
    .eq("slug", slug)
    .eq("status", "active")
    .single();

  if (!service) {
    notFound();
  }

  const typedService = service as Service;

  return (
    <article className="bg-white">
      <section className="bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <Link
              href="/services"
              className="inline-flex items-center text-[#FF000E] hover:underline mb-6"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Services
            </Link>

            <span className="inline-block text-sm px-3 py-1 bg-[#FF000E]/10 text-[#FF000E] rounded-full mb-4 capitalize">
              {typedService.type}
            </span>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-4">
              {typedService.title}
            </h1>
          </div>
        </div>
      </section>

      {typedService.description && (
        <section className="container-custom py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-12">
              {renderContent(typedService.description)}
            </div>
          </div>
        </section>
      )}

      <section className="bg-[#333333] text-white py-16">
        <div className="container-custom text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Interested in this service?
          </h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Let&apos;s discuss how we can help your business grow with our expertise.
          </p>
          <Link href="/contact">
            <Button variant="primary">Get in Touch</Button>
          </Link>
          <div className="flex items-center justify-center gap-4 mt-6">
            <Link href="/case-studies">
              <Button variant="outline-light" size="sm">
                Case Studies
              </Button>
            </Link>
            <Link href="/insights">
              <Button variant="outline-light" size="sm">
                Insights
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}
