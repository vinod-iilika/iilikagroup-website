import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import ServicesProductsCarousel from "@/components/ServicesProductsCarousel";
import Link from "next/link";

export default function Services() {
  const services = [
    {
      id: "staffing",
      title: "Staffing & Deployed Resources",
      description: "Expert IT professionals ready to join your team",
      features: [
        "Onsite, hybrid, and remote engineers",
        "Permanent and contract IT hiring",
        "Pre-vetted technical talent",
        "Quick deployment timelines",
        "Flexible engagement models",
      ],
      cta: "Hire Talent",
      link: "/staffing",
    },
    {
      id: "gcc",
      title: "GCC Enablement",
      description: "End-to-end GCC setup and scaling support",
      features: [
        "GCC setup and infrastructure",
        "Talent acquisition and onboarding",
        "Infrastructure partner network",
        "Transition and scaling support",
        "Ongoing operational support",
      ],
      cta: "Setup Your GCC",
      link: "/gcc-enablement",
    },
    {
      id: "projects",
      title: "Service-based Project Delivery",
      description: "Complete project ownership and delivery",
      features: [
        "Managed development squads",
        "Fixed-scope engagements",
        "Time & Materials model",
        "Retainer-based support",
        "Full-stack capabilities",
      ],
      cta: "Start a Project",
      link: "/service-based-projects",
    },
  ];

  return (
    <>
      <section className="bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">Our Services</h1>
            <p className="text-xl text-[#333333] leading-relaxed">
              Comprehensive IT solutions tailored to your business needs
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-custom space-y-16">
          {services.map((service, index) => (
            <div
              key={service.id}
              id={service.id}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">{service.title}</h2>
                <p className="text-lg text-[#333333] mb-6 leading-relaxed">{service.description}</p>
                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <svg
                        className="w-6 h-6 text-[#FF000E] mr-3 mt-1 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-[#333333]">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href={service.link}>
                  <Button variant="primary">{service.cta}</Button>
                </Link>
              </div>
              <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                <Card className="h-[350px] bg-gradient-to-br from-gray-100 to-gray-200"></Card>
              </div>
            </div>
          ))}
        </div>
      </section>

      <ServicesProductsCarousel />

      <section className="bg-[#333333] text-white py-16">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
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
              <Button variant="outline" size="sm" className="border-white text-white hover:bg-white hover:text-[#333333]">
                Case Studies
              </Button>
            </Link>
            <Link href="/insights">
              <Button variant="outline" size="sm" className="border-white text-white hover:bg-white hover:text-[#333333]">
                Insights
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
