"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const serviceSubLinks = [
  { name: "Staffing Solutions", href: "/staffing" },
  { name: "GCC Enablement", href: "/gcc-enablement" },
  { name: "Project Delivery", href: "/service-based-projects" },
];

const servicePaths = ["/services", "/staffing", "/gcc-enablement", "/service-based-projects"];

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services and Products", href: "/services", hasDropdown: true },
  { name: "Insights", href: "/insights" },
  { name: "Case Studies", href: "/case-studies" },
  { name: "Careers", href: "/careers" },
  { name: "Contact", href: "/contact" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isTransparent = isHome && !scrolled;

  const isActive = (href: string, hasDropdown?: boolean) => {
    if (hasDropdown) {
      return servicePaths.some((p) => pathname.startsWith(p));
    }
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isTransparent
          ? "bg-transparent"
          : "bg-white border-b border-gray-200 shadow-sm"
      }`}
    >
      <nav className="container-custom">
        <div className="flex items-center justify-between h-20">
          <Link href="/">
            <Image
              src="/images/iilika-groups.svg"
              alt="IILIKA GROUPS"
              width={150}
              height={50}
              className="h-12 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {navLinks.map((link) =>
              link.hasDropdown ? (
                <div key={link.href} className="relative group">
                  <Link
                    href={link.href}
                    className={`font-medium transition-colors duration-200 inline-flex items-center gap-1 ${
                      isActive(link.href, true)
                        ? isTransparent
                          ? "text-white border-b-2 border-white"
                          : "text-[#FF000E] border-b-2 border-[#FF000E]"
                        : isTransparent
                          ? "text-white/70 hover:text-white"
                          : "text-[#333333] hover:text-[#FF000E]"
                    }`}
                  >
                    {link.name}
                    <svg
                      className="w-4 h-4 transition-transform group-hover:rotate-180"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </Link>

                  {/* Dropdown */}
                  <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[200px]">
                      {serviceSubLinks.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className={`block px-4 py-2.5 text-sm transition-colors ${
                            pathname.startsWith(sub.href)
                              ? "text-[#FF000E] bg-red-50 font-medium"
                              : "text-[#333333] hover:text-[#FF000E] hover:bg-gray-50"
                          }`}
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-medium transition-colors duration-200 ${
                    isActive(link.href)
                      ? isTransparent
                        ? "text-white border-b-2 border-white"
                        : "text-[#FF000E] border-b-2 border-[#FF000E]"
                      : isTransparent
                        ? "text-white/70 hover:text-white"
                        : "text-[#333333] hover:text-[#FF000E]"
                  }`}
                >
                  {link.name}
                </Link>
              )
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className={`lg:hidden focus:outline-none ${
              isTransparent ? "text-white" : "text-[#333333]"
            }`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className={`lg:hidden py-4 border-t ${
            isTransparent ? "border-white/20 bg-black/30 backdrop-blur-sm" : "border-gray-200"
          }`}>
            {navLinks.map((link) =>
              link.hasDropdown ? (
                <div key={link.href}>
                  <button
                    onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                    className={`w-full flex items-center justify-between py-3 font-medium transition-colors duration-200 ${
                      isActive(link.href, true)
                        ? isTransparent
                          ? "text-white font-bold"
                          : "text-[#FF000E] font-bold"
                        : isTransparent
                          ? "text-white/70 hover:text-white"
                          : "text-[#333333] hover:text-[#FF000E]"
                    }`}
                  >
                    {link.name}
                    <svg
                      className={`w-4 h-4 transition-transform ${mobileServicesOpen ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {mobileServicesOpen && (
                    <div className="pl-4 pb-2">
                      <Link
                        href={link.href}
                        className={`block py-2 text-sm transition-colors ${
                          pathname === "/services"
                            ? isTransparent ? "text-white font-bold" : "text-[#FF000E] font-bold"
                            : isTransparent ? "text-white/70 hover:text-white" : "text-[#333333] hover:text-[#FF000E]"
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        All Services & Products
                      </Link>
                      {serviceSubLinks.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className={`block py-2 text-sm transition-colors ${
                            pathname.startsWith(sub.href)
                              ? isTransparent ? "text-white font-bold" : "text-[#FF000E] font-bold"
                              : isTransparent ? "text-white/70 hover:text-white" : "text-[#333333] hover:text-[#FF000E]"
                          }`}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block py-3 font-medium transition-colors duration-200 ${
                    isActive(link.href)
                      ? isTransparent
                        ? "text-white font-bold"
                        : "text-[#FF000E] font-bold"
                      : isTransparent
                        ? "text-white/70 hover:text-white"
                        : "text-[#333333] hover:text-[#FF000E]"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              )
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
