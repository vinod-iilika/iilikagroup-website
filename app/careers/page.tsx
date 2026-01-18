import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function Careers() {
  const openings = [
    {
      title: "Senior Full Stack Developer",
      location: "Pune / Remote",
      experience: "5-8 years",
      techStack: ["React", "Node.js", "TypeScript", "AWS"],
    },
    {
      title: "DevOps Engineer",
      location: "Pune / Hybrid",
      experience: "3-5 years",
      techStack: ["Docker", "Kubernetes", "AWS", "CI/CD"],
    },
    {
      title: "Java Backend Developer",
      location: "Client Location",
      experience: "4-7 years",
      techStack: ["Java", "Spring Boot", "Microservices", "PostgreSQL"],
    },
    {
      title: "React Native Developer",
      location: "Remote",
      experience: "3-6 years",
      techStack: ["React Native", "JavaScript", "Mobile Development"],
    },
    {
      title: "Data Engineer",
      location: "Pune / Remote",
      experience: "4-6 years",
      techStack: ["Python", "Spark", "AWS", "Data Pipelines"],
    },
  ];

  const benefits = [
    { icon: "💰", title: "Competitive Salary", description: "Market-leading compensation packages" },
    { icon: "🏥", title: "Health Insurance", description: "Comprehensive coverage for you and family" },
    { icon: "🌴", title: "Flexible Work", description: "Remote and hybrid work options" },
    { icon: "📚", title: "Learning & Development", description: "Training and certification support" },
    { icon: "🚀", title: "Career Growth", description: "Clear progression paths and mentorship" },
    { icon: "⚖️", title: "Work-Life Balance", description: "Flexible hours and time-off policies" },
  ];

  return (
    <>
      <section className="bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">Join Our Team</h1>
            <p className="text-xl text-[#333333] leading-relaxed">
              Build your career with IILIKA GROUPS. Explore opportunities to work with leading enterprises.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">Current Openings</h2>
            <p className="text-lg text-[#333333] max-w-3xl mx-auto">
              Join our team of talented professionals
            </p>
          </div>

          <div className="space-y-6 max-w-4xl mx-auto">
            {openings.map((job, index) => (
              <Card key={index}>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-black mb-2">{job.title}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-[#333333] mb-3">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {job.location}
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {job.experience}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {job.techStack.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-gray-100 text-[#333333] text-xs rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Button variant="primary" size="sm">
                      Apply Now
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">Why Work With Us</h2>
            <p className="text-lg text-[#333333] max-w-3xl mx-auto">
              Benefits and perks that make a difference
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center">
                <div className="text-5xl mb-4">{benefit.icon}</div>
                <h3 className="text-lg font-semibold text-black mb-2">{benefit.title}</h3>
                <p className="text-[#333333] text-sm leading-relaxed">{benefit.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-custom">
          <Card className="max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-black mb-6 text-center">
              General Application
            </h2>
            <p className="text-[#333333] mb-6 text-center">
              Don't see a perfect match? Submit your profile and we'll reach out when opportunities arise.
            </p>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#333333] mb-2">Full Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#E30613]"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#333333] mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#E30613]"
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#333333] mb-2">
                  Interested Role
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#E30613]">
                  <option>Select a role</option>
                  <option>Full Stack Developer</option>
                  <option>Backend Developer</option>
                  <option>Frontend Developer</option>
                  <option>DevOps Engineer</option>
                  <option>Data Engineer</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#333333] mb-2">
                  Resume / LinkedIn Profile
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#E30613]"
                  placeholder="Link to your resume or LinkedIn profile"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#333333] mb-2">Message</label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#E30613]"
                  placeholder="Tell us about yourself and your experience"
                ></textarea>
              </div>
              <Button type="submit" variant="primary" className="w-full">
                Submit Application
              </Button>
            </form>
          </Card>
        </div>
      </section>
    </>
  );
}
