"use client";

import { useState, useEffect } from "react";
import Card from "./ui/Card";
import { createClient } from "@/lib/supabase";
import Image from "next/image";

interface Service {
  id: string;
  title: string;
  description: string | null;
  icon_name: string | null;
}

interface Product {
  id: string;
  title: string;
  tagline: string | null;
  image_url: string | null;
  technologies: string[];
  slug: string;
}

function Carousel({
  title,
  subtitle,
  children,
  itemCount,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode[];
  itemCount: number;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Items per view based on screen size — we use a fixed 3 for calculations
  // and let CSS handle responsive visibility
  const itemsPerView = 3;
  const maxIndex = Math.max(0, itemCount - itemsPerView);

  useEffect(() => {
    if (!isAutoPlaying || itemCount <= itemsPerView) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, itemCount, maxIndex, itemsPerView]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    setIsAutoPlaying(false);
  };

  if (itemCount === 0) return null;

  return (
    <div>
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">{title}</h2>
        <p className="text-lg text-[#333333] max-w-3xl mx-auto">{subtitle}</p>
      </div>

      <div className="relative">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
            }}
          >
            {children.map((child, index) => (
              <div
                key={index}
                className="w-full sm:w-1/2 lg:w-1/3 flex-shrink-0 px-3"
              >
                {child}
              </div>
            ))}
          </div>
        </div>

        {itemCount > itemsPerView && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute -left-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors z-10"
              aria-label="Previous"
            >
              <svg className="w-6 h-6 text-[#333333]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={goToNext}
              className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors z-10"
              aria-label="Next"
            >
              <svg className="w-6 h-6 text-[#333333]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <div className="flex justify-center mt-6 gap-2">
              {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index);
                    setIsAutoPlaying(false);
                  }}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentIndex ? "bg-[#FF000E] w-8" : "bg-gray-300"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function ServicesProductsCarousel() {
  const [services, setServices] = useState<Service[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const supabase = createClient();

    async function fetchData() {
      const [servicesRes, productsRes] = await Promise.all([
        supabase
          .from("services")
          .select("id, title, description, icon_name")
          .eq("status", "active")
          .eq("type", "offering")
          .order("display_order"),
        supabase
          .from("products")
          .select("id, title, tagline, image_url, technologies, slug")
          .eq("status", "active")
          .order("featured", { ascending: false })
          .order("display_order"),
      ]);

      if (!servicesRes.error && servicesRes.data) setServices(servicesRes.data);
      if (!productsRes.error && productsRes.data) setProducts(productsRes.data);
    }

    fetchData();
  }, []);

  if (services.length === 0 && products.length === 0) return null;

  return (
    <>
      {services.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="container-custom">
            <Carousel
              title="More Services We Offer"
              subtitle="Specialized offerings to support your business growth"
              itemCount={services.length}
            >
              {services.map((service) => (
                <Card key={service.id} className="h-full">
                  {service.icon_name && (
                    <div className="w-12 h-12 bg-[#FF000E]/10 rounded-lg flex items-center justify-center mb-4">
                      <span className="text-[#FF000E] text-xl font-bold">
                        {service.icon_name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <h3 className="text-lg font-semibold text-black mb-2">{service.title}</h3>
                  {service.description && (
                    <p className="text-[#333333] text-sm leading-relaxed line-clamp-3">
                      {service.description}
                    </p>
                  )}
                </Card>
              ))}
            </Carousel>
          </div>
        </section>
      )}

      {products.length > 0 && (
        <section className="bg-white py-16">
          <div className="container-custom">
            <Carousel
              title="Our Products"
              subtitle="Solutions built to solve real-world challenges"
              itemCount={products.length}
            >
              {products.map((product) => (
                <Card key={product.id} className="h-full">
                  {product.image_url && (
                    <div className="relative w-full h-40 mb-4 rounded overflow-hidden bg-gray-100">
                      <Image
                        src={product.image_url}
                        alt={product.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <h3 className="text-lg font-semibold text-black mb-1">{product.title}</h3>
                  {product.tagline && (
                    <p className="text-[#333333] text-sm mb-3 leading-relaxed line-clamp-2">
                      {product.tagline}
                    </p>
                  )}
                  {product.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1">
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
                </Card>
              ))}
            </Carousel>
          </div>
        </section>
      )}
    </>
  );
}
