import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import Image from "next/image";
import Link from "next/link";

// Disable caching to always fetch fresh data
export const dynamic = "force-dynamic";

interface Product {
  id: string;
  slug: string;
  title: string;
  tagline?: string;
  type: "internal" | "client" | "partner";
  client_name?: string;
  features: string[];
  technologies: string[];
  image_url?: string;
  external_url?: string;
  featured: boolean;
}

export const metadata = {
  title: "Products",
  description:
    "Explore our technology products, client deliveries, and partner solutions at IILIKA GROUPS.",
};

const typeLabels: Record<string, { label: string; description: string }> = {
  internal: {
    label: "Our Products",
    description: "Technology solutions built by IILIKA GROUPS",
  },
  client: {
    label: "Client Deliveries",
    description: "Successful products we've built for our clients",
  },
  partner: {
    label: "Partner Solutions",
    description: "Tools and technologies we partner with",
  },
};

export default async function ProductsPage() {
  const supabase = await createServerSupabaseClient();

  const { data: products } = await supabase
    .from("products")
    .select(`
      id,
      slug,
      title,
      tagline,
      type,
      client_name,
      features,
      technologies,
      image_url,
      external_url,
      featured
    `)
    .eq("status", "active")
    .order("featured", { ascending: false })
    .order("display_order");

  // Group products by type
  const groupedProducts = products?.reduce(
    (acc, product) => {
      const type = product.type as keyof typeof typeLabels;
      if (!acc[type]) acc[type] = [];
      acc[type].push(product);
      return acc;
    },
    {} as Record<string, Product[]>
  );

  const renderProductCard = (product: Product) => (
    <Card key={product.id} className="flex flex-col h-full">
      {product.image_url && (
        <div className="relative h-48 -mx-6 -mt-6 mb-6 overflow-hidden rounded-t-lg">
          <Image
            src={product.image_url}
            alt={product.title}
            fill
            className="object-cover"
          />
          {product.featured && (
            <span className="absolute top-3 right-3 text-xs px-2 py-1 bg-[#FF000E] text-white rounded">
              Featured
            </span>
          )}
        </div>
      )}

      <div className="flex items-start justify-between mb-2">
        <h3 className="text-xl font-semibold text-black">{product.title}</h3>
      </div>

      {product.tagline && (
        <p className="text-[#333333] mb-4">{product.tagline}</p>
      )}

      {product.client_name && (
        <p className="text-sm text-[#333333] mb-3">
          Built for: {product.client_name}
        </p>
      )}

      {product.features && product.features.length > 0 && (
        <ul className="text-sm text-[#333333] space-y-1 mb-4">
          {product.features.slice(0, 3).map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <svg className="w-4 h-4 text-[#FF000E] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      )}

      {product.technologies && product.technologies.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {product.technologies.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="text-xs px-2 py-1 bg-gray-100 text-[#333333] rounded"
            >
              {tech}
            </span>
          ))}
        </div>
      )}

      <div className="mt-auto flex gap-2">
        <Link href={`/products/${product.slug}`} className="flex-1">
          <Button variant="outline" size="sm" className="w-full">
            Learn More
          </Button>
        </Link>
        {product.external_url && (
          <a
            href={product.external_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0"
          >
            <Button variant="primary" size="sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </Button>
          </a>
        )}
      </div>
    </Card>
  );

  return (
    <>
      <section className="bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">Products</h1>
            <p className="text-xl text-[#333333] leading-relaxed">
              Innovative solutions powering businesses across industries
            </p>
          </div>
        </div>
      </section>

      {products && products.length > 0 ? (
        <>
          {/* Featured Products */}
          {products.some((p) => p.featured) && (
            <section className="bg-white py-16">
              <div className="container-custom">
                <h2 className="text-2xl font-bold text-black mb-8">Featured Products</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {products
                    .filter((p) => p.featured)
                    .map((product) => renderProductCard(product as Product))}
                </div>
              </div>
            </section>
          )}

          {/* Products by Type */}
          {groupedProducts &&
            (Object.keys(typeLabels) as Array<keyof typeof typeLabels>).map(
              (type) =>
                groupedProducts[type] &&
                groupedProducts[type].length > 0 && (
                  <section
                    key={type}
                    className={type === "client" ? "bg-gray-50 py-16" : "bg-white py-16"}
                  >
                    <div className="container-custom">
                      <div className="mb-8">
                        <h2 className="text-2xl font-bold text-black mb-2">
                          {typeLabels[type].label}
                        </h2>
                        <p className="text-[#333333]">{typeLabels[type].description}</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {groupedProducts[type].map((product) =>
                          renderProductCard(product)
                        )}
                      </div>
                    </div>
                  </section>
                )
            )}
        </>
      ) : (
        <section className="bg-white py-16">
          <div className="container-custom">
            <div className="text-center py-16">
              <p className="text-xl text-[#333333] mb-4">No products listed yet.</p>
              <p className="text-[#333333]">Check back soon for our technology solutions.</p>
            </div>
          </div>
        </section>
      )}

      <section className="bg-[#333333] text-white py-16">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Have a product idea?</h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Let's build something great together. Our team can help turn your vision into reality.
          </p>
          <Link href="/contact">
            <Button variant="primary" size="lg">
              Let's Talk
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
