import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import ServicesProductsCarousel from "@/components/ServicesProductsCarousel";
import Link from "next/link";

export default function GCCEnablement() {
  const setupProcess = [
    {
      step: "01",
      title: "Strategy & Planning",
      description: "Define GCC objectives, location, and operational model",
    },
    {
      step: "02",
      title: "Infrastructure Setup",
      description: "Establish physical and technical infrastructure with partner network",
    },
    {
      step: "03",
      title: "Talent Acquisition",
      description: "Recruit and onboard skilled professionals aligned with your needs",
    },
    {
      step: "04",
      title: "Launch & Scale",
      description: "Go-live support and scaling to meet growing demands",
    },
  ];

  const models = [
    {
      title: "Build-Operate-Transfer (BOT)",
      description: "We build and operate your GCC, then transfer full ownership to you when ready.",
    },
    {
      title: "Build-Operate-Maintain (BOM)",
      description: "We build and continue operating your GCC on an ongoing basis.",
    },
    {
      title: "Consulting & Advisory",
      description: "Strategic guidance for organizations building GCCs independently.",
    },
  ];

  return (
    <>
      <section className="bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">GCC Enablement</h1>
            <p className="text-xl text-[#333333] leading-relaxed">
              Complete GCC setup, talent acquisition, and scaling support for global enterprises
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">Our GCC Setup Process</h2>
            <p className="text-lg text-[#333333] max-w-3xl mx-auto">
              A proven four-phase approach to establishing your Global Capability Center
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {setupProcess.map((phase, index) => (
              <Card key={index} className="relative">
                <div className="text-5xl font-bold text-[#FF000E] mb-4 opacity-20">{phase.step}</div>
                <h3 className="text-xl font-semibold text-black mb-3">{phase.title}</h3>
                <p className="text-[#333333] leading-relaxed">{phase.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">Engagement Models</h2>
            <p className="text-lg text-[#333333] max-w-3xl mx-auto">
              Flexible models to match your GCC strategy
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {models.map((model, index) => (
              <Card key={index}>
                <h3 className="text-xl font-semibold text-black mb-4">{model.title}</h3>
                <p className="text-[#333333] leading-relaxed">{model.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">Key Metrics We Deliver</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { metric: "30-45 Days", label: "Time to First Hire" },
              { metric: "40-60%", label: "Cost Savings" },
              { metric: "100+", label: "Roles Filled per GCC" },
              { metric: "10+", label: "GCCs Enabled" },
            ].map((item, index) => (
              <Card key={index} className="text-center">
                <div className="text-4xl font-bold text-[#FF000E] mb-2">{item.metric}</div>
                <div className="text-[#333333] font-medium">{item.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <ServicesProductsCarousel />

      <section className="bg-[#333333] text-white py-16">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Set Up Your GCC?</h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Let&apos;s discuss your GCC strategy and how we can help you establish a world-class capability center.
          </p>
          <Link href="/contact">
            <Button variant="primary" size="lg">
              Schedule a Consultation
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
