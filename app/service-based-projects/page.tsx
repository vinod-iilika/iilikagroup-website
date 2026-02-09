import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import ServicesProductsCarousel from "@/components/ServicesProductsCarousel";
import Link from "next/link";

export default function ServiceBasedProjects() {
  const techStacks = [
    { name: "Frontend", technologies: "React, Next.js, Vue, Angular, TypeScript" },
    { name: "Backend", technologies: "Node.js, Python, Java, .NET, Go" },
    { name: "Mobile", technologies: "React Native, Flutter, iOS, Android" },
    { name: "Cloud & DevOps", technologies: "AWS, Azure, GCP, Docker, Kubernetes" },
    { name: "Data & AI", technologies: "PostgreSQL, MongoDB, ML/AI, Data Engineering" },
  ];

  const engagementModels = [
    {
      title: "Fixed-Scope Projects",
      description: "Well-defined deliverables with fixed timeline and budget",
      bestFor: "Clear requirements, specific outcomes",
      icon: "📋",
    },
    {
      title: "Time & Materials",
      description: "Flexible engagement billed on actual time and resources",
      bestFor: "Evolving requirements, ongoing development",
      icon: "⏱️",
    },
    {
      title: "Retainer Model",
      description: "Dedicated team on monthly retainer for continuous delivery",
      bestFor: "Long-term partnerships, continuous improvement",
      icon: "🔄",
    },
  ];

  return (
    <>
      <section className="bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">
              Service-based Project Delivery
            </h1>
            <p className="text-xl text-[#333333] leading-relaxed">
              Full project ownership with managed development squads and proven delivery excellence
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
                Complete Project Ownership
              </h2>
              <div className="space-y-4 text-[#333333] leading-relaxed">
                <p>
                  Like leading service providers such as TechM and Wipro, we take full ownership of your project from conception to delivery. Our managed squads work as an extension of your team.
                </p>
                <p>
                  We handle everything: requirements analysis, architecture design, development, testing, deployment, and ongoing maintenance. You get predictable outcomes without the overhead of managing individual contractors.
                </p>
              </div>
              <ul className="space-y-3 mt-6">
                {[
                  "End-to-end project management",
                  "Dedicated development squads",
                  "Agile delivery methodology",
                  "Quality assurance & testing",
                  "Post-deployment support",
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
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">Engagement Models</h2>
            <p className="text-lg text-[#333333] max-w-3xl mx-auto">
              Choose the model that best fits your project needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {engagementModels.map((model, index) => (
              <Card key={index}>
                <div className="text-5xl mb-4">{model.icon}</div>
                <h3 className="text-xl font-semibold text-black mb-3">{model.title}</h3>
                <p className="text-[#333333] mb-4 leading-relaxed">{model.description}</p>
                <p className="text-sm text-[#FF000E] font-medium">Best for: {model.bestFor}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">Technology Expertise</h2>
            <p className="text-lg text-[#333333] max-w-3xl mx-auto">
              Full-stack capabilities across modern technology stacks
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {techStacks.map((stack, index) => (
              <Card key={index}>
                <h3 className="text-lg font-semibold text-black mb-2">{stack.name}</h3>
                <p className="text-[#333333] text-sm leading-relaxed">{stack.technologies}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <ServicesProductsCarousel />

      <section className="bg-[#333333] text-white py-16">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Start Your Next Project</h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Let&apos;s discuss your project requirements and how our managed squads can deliver results.
          </p>
          <Link href="/contact">
            <Button variant="primary" size="lg">
              Discuss Your Project
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
