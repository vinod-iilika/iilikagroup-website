import Button from "./ui/Button";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-16 lg:py-24">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black leading-tight">
              Building teams and GCCs that deliver.
            </h1>
            <p className="text-lg md:text-xl text-[#333333] leading-relaxed">
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
                  <span className="text-[#333333] text-lg">{item}</span>
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

          <div className="relative h-[400px] lg:h-[500px] bg-gradient-to-br from-[#FF000E] to-[#9E0008] rounded-lg overflow-hidden shadow-xl">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white p-8">
                <svg
                  className="w-24 h-24 mx-auto mb-4 opacity-50"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                </svg>
                <p className="text-lg font-medium">Video Placeholder</p>
                <p className="text-sm opacity-75 mt-2">Replace with your hero video</p>
              </div>
            </div>
            <div className="absolute inset-0 bg-black opacity-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
