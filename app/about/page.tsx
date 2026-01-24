import Card from "@/components/ui/Card";

export default function About() {
  const values = [
    {
      title: "Excellence",
      description: "Delivering top-tier talent and solutions that exceed expectations.",
      icon: "⭐",
    },
    {
      title: "Integrity",
      description: "Building trust through transparent and honest partnerships.",
      icon: "🤝",
    },
    {
      title: "Innovation",
      description: "Embracing modern technologies and methodologies.",
      icon: "💡",
    },
    {
      title: "Commitment",
      description: "Dedicated to long-term success of our clients and teams.",
      icon: "🎯",
    },
  ];

  return (
    <>
      <section className="bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">About IILIKA GROUPS</h1>
            <p className="text-xl text-[#333333] leading-relaxed">
              Your trusted partner for IT staffing, GCC enablement, and service-based project delivery
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">Our Story</h2>
              <div className="space-y-4 text-[#333333] leading-relaxed">
                <p>
                  IILIKA GROUPS was founded with a vision to bridge the gap between enterprise talent needs and skilled IT professionals. Based in Lohegaon, Pune, we've grown into a comprehensive technology services provider.
                </p>
                <p>
                  We specialize in three core areas: IT staffing and deployed resources, GCC (Global Capability Center) enablement, and service-based project delivery. Our approach combines deep technical expertise with a commitment to understanding our clients' unique business challenges.
                </p>
                <p>
                  Today, we serve 50+ enterprise clients across industries, having deployed over 500 engineers and enabled multiple GCC setups. Our 95% client retention rate speaks to the quality and reliability of our services.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#FF000E] to-[#9E0008] h-[400px] rounded-lg shadow-xl"></div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">Our Values</h2>
            <p className="text-lg text-[#333333] max-w-3xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center">
                <div className="text-5xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold text-black mb-3">{value.title}</h3>
                <p className="text-[#333333] leading-relaxed">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">Our Presence</h2>
          </div>

          <div className="max-w-2xl mx-auto">
            <Card className="text-center">
              <h3 className="text-2xl font-semibold text-black mb-4">Headquarters</h3>
              <p className="text-lg text-[#333333] mb-2">Lohegaon, Pune, India</p>
              <p className="text-[#333333]">
                Strategically located to serve clients across India and globally
              </p>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
