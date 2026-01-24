import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#333333] text-white mt-20">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-[#FF000E] mb-4">IILIKA GROUPS</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Building teams and GCCs that deliver. Staffing, GCC enablement, and project delivery for modern enterprises.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/services" className="text-gray-300 hover:text-[#FF000E] transition-colors">
                  Staffing & Deployed Resources
                </Link>
              </li>
              <li>
                <Link href="/gcc-enablement" className="text-gray-300 hover:text-[#FF000E] transition-colors">
                  GCC Enablement
                </Link>
              </li>
              <li>
                <Link href="/service-based-projects" className="text-gray-300 hover:text-[#FF000E] transition-colors">
                  Service-based Projects
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-[#FF000E] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-300 hover:text-[#FF000E] transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-[#FF000E] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <address className="text-gray-300 text-sm not-italic leading-relaxed">
              Lohegaon, Pune, India
              <br />
              <a href="mailto:info@iilikagroups.com" className="hover:text-[#FF000E] transition-colors">
                info@iilikagroups.com
              </a>
            </address>
          </div>
        </div>

        <div className="border-t border-gray-600 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {currentYear} IILIKA GROUPS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
