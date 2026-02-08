import Button from "./ui/Button";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative h-screen -mt-20 overflow-hidden">
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
      <div className="relative z-10 h-full flex items-end pb-24 md:items-center md:pb-0">
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24">
          <div className="max-w-3xl space-y-6">
            {/* Red accent bar */}
            <div className="w-12 h-1 bg-[#FF000E]" />
            <p className="text-sm md:text-base uppercase tracking-[0.2em] text-white/80 font-medium">
              Staffing &middot; GCC Enablement &middot; Project Delivery
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-[0.95] uppercase">
              Building teams and GCCs that deliver
            </h1>
            <p className="text-base md:text-lg text-white/80 uppercase tracking-wide">
              Deployed staffing, GCC setup &amp; scaling, and project-based delivery for modern enterprises
            </p>
            <div className="pt-4">
              <Link href="/services">
                <Button variant="primary" size="lg">
                  Explore Services
                  <svg
                    className="w-5 h-5 ml-2 inline-block"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
