import Hero from "@/components/Hero";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";

export default function Home() {
  const services = [
    {
      title: "Staffing & Deployed Resources",
      description: "Onsite, hybrid, and remote engineers. Permanent and contract IT hiring tailored to your needs.",
      icon: "👥",
      link: "/services#staffing",
    },
    {
      title: "GCC Enablement",
      description: "Complete GCC setup with talent acquisition and infrastructure partners. Scale and transition support.",
      icon: "🏢",
      link: "/gcc-enablement",
    },
    {
      title: "Service-based Project Delivery",
      description: "Full project ownership with managed squads. Fixed-scope, T&M, and retainer engagement models.",
      icon: "🚀",
      link: "/service-based-projects",
    },
  ];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "IILIKA GROUPS",
          url: "https://iilikagroups.com",
        }}
      />
      <Hero />

      <section className="bg-gray-50 py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">Our Core Services</h2>
            <p className="text-lg text-[#333333] max-w-3xl mx-auto">
              Three pillars of excellence powering modern enterprises
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="text-center">
                <div className="text-6xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold text-black mb-3">{service.title}</h3>
                <p className="text-[#333333] mb-6 leading-relaxed">{service.description}</p>
                <Link href={service.link}>
                  <Button variant="outline" size="sm">
                    Learn More
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">Why Choose IILIKA GROUPS</h2>
            <p className="text-lg text-[#333333] max-w-3xl mx-auto">
              Trusted partner for building high-performance teams
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { number: "180+", label: "Engineers Deployed" },
              { number: "50+", label: "Enterprise Clients" },
              { number: "5+", label: "GCCs Enabled" },
              { number: "95%", label: "Client Retention" },
            ].map((stat, index) => (
              <div key={index} className="text-center p-6">
                <div className="text-5xl font-bold text-[#FF000E] mb-2">{stat.number}</div>
                <div className="text-[#333333] font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">Client Testimonials</h2>
            <p className="text-lg text-[#333333] max-w-3xl mx-auto">
              Hear what our clients say about working with us
            </p>
          </div>
          <TestimonialsCarousel />
        </div>
      </section>

      <section className="bg-[#333333] text-white py-16">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Build Your Team?</h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Let&apos;s discuss how we can help you with staffing, GCC enablement, or project delivery.
          </p>
          <Link href="/contact">
            <Button variant="primary" size="lg">
              Get in Touch
            </Button>
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
    </>
  );
}
