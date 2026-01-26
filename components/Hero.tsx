import Button from "./ui/Button";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative h-[600px] lg:h-[700px] overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/hero-video.mp4" type="video/mp4" />
      </video>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container-custom">
          <div className="max-w-2xl space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Building teams and GCCs that deliver.
            </h1>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed">
              Staffing, GCC enablement, project delivery for modern enterprises.
            </p>
            <ul className="space-y-3">
              {[
                "Deployed staffing & IT hiring",
                "GCC setup & scaling",
                "Project-based delivery",
              ].map((item, index) => (
                <li key={index} className="flex items-start">
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
                  <span className="text-white text-lg">{item}</span>
                </li>
              ))}
            </ul>
            <div className="pt-4">
              <Link href="/services">
                <Button variant="primary" size="lg">
                  Explore Services
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
