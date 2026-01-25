import { createServerSupabaseClient } from "@/lib/supabase-server";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Button from "@/components/ui/Button";

// Disable caching to always fetch fresh data
export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

interface Product {
  id: string;
  slug: string;
  title: string;
  tagline?: string;
  description?: string;
  type: "internal" | "client" | "partner";
  client_name?: string;
  features: string[];
  technologies: string[];
  image_url?: string;
  external_url?: string;
  seo_title?: string;
  seo_description?: string;
}

const typeLabels: Record<string, string> = {
  internal: "IILIKA Product",
  client: "Client Delivery",
  partner: "Partner Solution",
};

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: product } = await supabase
    .from("products")
    .select("title, tagline, seo_title, seo_description")
    .eq("slug", slug)
    .eq("status", "active")
    .single();

  if (!product) {
    return { title: "Product Not Found | IILIKA GROUPS" };
  }

  return {
    title: product.seo_title || `${product.title} | IILIKA GROUPS`,
    description: product.seo_description || product.tagline,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: product } = await supabase
    .from("products")
    .select(`
      id,
      slug,
      title,
      tagline,
      description,
      type,
      client_name,
      features,
      technologies,
      image_url,
      external_url,
      seo_title,
      seo_description
    `)
    .eq("slug", slug)
    .eq("status", "active")
    .single();

  if (!product) {
    notFound();
  }

  const typedProduct = product as Product;

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
                href="/products"
                className="inline-flex items-center text-[#FF000E] hover:underline mb-6"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Products
              </Link>

              <span className="inline-block text-sm px-3 py-1 bg-[#FF000E]/10 text-[#FF000E] rounded-full mb-4">
                {typeLabels[typedProduct.type]}
              </span>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-4">
                {typedProduct.title}
              </h1>

              {typedProduct.tagline && (
                <p className="text-xl text-[#333333] mb-6">{typedProduct.tagline}</p>
              )}

              {typedProduct.client_name && (
                <p className="text-[#333333]">
                  Built for: <span className="font-medium">{typedProduct.client_name}</span>
                </p>
              )}

              {typedProduct.external_url && (
                <div className="mt-6">
                  <a
                    href={typedProduct.external_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="primary">
                      Visit Product
                      <svg className="w-4 h-4 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </Button>
                  </a>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Product Image */}
        {typedProduct.image_url && (
          <section className="container-custom py-8">
            <div className="max-w-4xl mx-auto">
              <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={typedProduct.image_url}
                  alt={typedProduct.title}
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
                {typedProduct.description && (
                  <div className="mb-12">
                    <h2 className="text-2xl font-bold text-black mb-4">About</h2>
                    {renderContent(typedProduct.description)}
                  </div>
                )}

                {typedProduct.features && typedProduct.features.length > 0 && (
                  <div className="mb-12">
                    <h2 className="text-2xl font-bold text-black mb-6">Key Features</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {typedProduct.features.map((feature, index) => (
                        <div
                          key={index}
                          className="bg-gray-50 rounded-lg p-4 flex items-start gap-3"
                        >
                          <div className="w-8 h-8 rounded-full bg-[#FF000E]/10 flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-[#FF000E]" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-[#333333]">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-8 bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-black mb-4">Product Details</h3>

                  <div className="mb-4">
                    <p className="text-sm text-[#333333]">Type</p>
                    <p className="font-medium text-black">{typeLabels[typedProduct.type]}</p>
                  </div>

                  {typedProduct.client_name && (
                    <div className="mb-4">
                      <p className="text-sm text-[#333333]">Client</p>
                      <p className="font-medium text-black">{typedProduct.client_name}</p>
                    </div>
                  )}

                  {typedProduct.technologies && typedProduct.technologies.length > 0 && (
                    <div className="mb-6">
                      <p className="text-sm text-[#333333] mb-2">Technologies</p>
                      <div className="flex flex-wrap gap-2">
                        {typedProduct.technologies.map((tech) => (
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
                      Discuss Similar Project
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gray-50 py-16">
          <div className="container-custom text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-black mb-4">
              Interested in building something similar?
            </h2>
            <p className="text-[#333333] mb-6 max-w-2xl mx-auto">
              Our team can help you design and build custom solutions tailored to your business needs.
            </p>
            <Link href="/contact">
              <Button variant="primary">Get in Touch</Button>
            </Link>
          </div>
        </section>
      </article>
    </>
  );
}
