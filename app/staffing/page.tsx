import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import ServicesProductsCarousel from "@/components/ServicesProductsCarousel";
import Link from "next/link";

export default function Staffing() {
  const hiringProcess = [
    {
      step: "01",
      title: "Requirement Analysis",
      description: "Understand your technical needs, team dynamics, and project goals",
    },
    {
      step: "02",
      title: "Talent Sourcing",
      description: "Identify and screen pre-vetted candidates from our talent pool",
    },
    {
      step: "03",
      title: "Interview & Selection",
      description: "Coordinate technical assessments and client interviews",
    },
    {
      step: "04",
      title: "Deployment & Onboarding",
      description: "Swift onboarding with ongoing performance monitoring and support",
    },
  ];

  const engagementModels = [
    {
      title: "Contract Staffing",
      description: "Skilled professionals deployed on a contract basis for project-specific needs.",
      bestFor: "Short-to-mid term projects, seasonal demand",
    },
    {
      title: "Permanent Hiring",
      description: "End-to-end recruitment for full-time roles within your organization.",
      bestFor: "Core team building, long-term roles",
    },
    {
      title: "Deployed Resources",
      description: "IILIKA employees working onsite at your location, managed by us.",
      bestFor: "Flexible capacity, reduced HR overhead",
    },
  ];

  const roles = [
    "Full-Stack Developers",
    "Frontend Engineers (React, Angular, Vue)",
    "Backend Engineers (Node.js, Java, Python, .NET)",
    "Mobile Developers (React Native, Flutter)",
    "DevOps & Cloud Engineers",
    "QA & Test Automation Engineers",
    "Data Engineers & Analysts",
    "UI/UX Designers",
    "Project Managers & Scrum Masters",
    "Technical Architects",
  ];

  return (
    <>
      <section className="bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">
              Staffing & Deployed Resources
            </h1>
            <p className="text-xl text-[#333333] leading-relaxed">
              Pre-vetted IT professionals ready to join your team — onsite, hybrid, or remote
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
                The Right Talent, Fast
              </h2>
              <div className="space-y-4 text-[#333333] leading-relaxed">
                <p>
                  Finding skilled IT professionals shouldn&apos;t slow down your business. IILIKA maintains a curated pool of pre-vetted engineers and specialists, enabling quick deployment timelines without compromising on quality.
                </p>
                <p>
                  Whether you need a single specialist or an entire team, our flexible engagement models adapt to your requirements. We handle sourcing, screening, and onboarding — you focus on building your product.
                </p>
              </div>
              <ul className="space-y-3 mt-6">
                {[
                  "Onsite, hybrid, and remote engineers",
                  "Permanent and contract IT hiring",
                  "Pre-vetted technical talent pool",
                  "Quick deployment — as fast as 2 weeks",
                  "Ongoing performance management",
                ].map((item, idx) => (
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
                    <span className="text-[#333333]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-[#FF000E] to-[#9E0008] h-[400px] rounded-lg shadow-xl"></div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">Our Hiring Process</h2>
            <p className="text-lg text-[#333333] max-w-3xl mx-auto">
              A streamlined four-step process to get the right talent on your team
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {hiringProcess.map((phase, index) => (
              <Card key={index} className="relative">
                <div className="text-5xl font-bold text-[#FF000E] mb-4 opacity-20">{phase.step}</div>
                <h3 className="text-xl font-semibold text-black mb-3">{phase.title}</h3>
                <p className="text-[#333333] leading-relaxed">{phase.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">Engagement Models</h2>
            <p className="text-lg text-[#333333] max-w-3xl mx-auto">
              Flexible staffing models to match your needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {engagementModels.map((model, index) => (
              <Card key={index}>
                <h3 className="text-xl font-semibold text-black mb-3">{model.title}</h3>
                <p className="text-[#333333] mb-4 leading-relaxed">{model.description}</p>
                <p className="text-sm text-[#FF000E] font-medium">Best for: {model.bestFor}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">Roles We Fill</h2>
            <p className="text-lg text-[#333333] max-w-3xl mx-auto">
              Technical talent across the full stack
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {roles.map((role, index) => (
              <div key={index} className="flex items-center gap-3 p-3">
                <svg
                  className="w-5 h-5 text-[#FF000E] flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-[#333333]">{role}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">Key Metrics</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { metric: "500+", label: "Engineers Deployed" },
              { metric: "2 Weeks", label: "Average Deployment Time" },
              { metric: "95%", label: "Client Retention Rate" },
              { metric: "50+", label: "Enterprise Clients" },
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
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Build Your Team?</h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Tell us about your hiring needs and we&apos;ll connect you with the right talent.
          </p>
          <Link href="/contact">
            <Button variant="primary" size="lg">
              Hire Talent Now
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
