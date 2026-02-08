"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isTransparent = isHome && !scrolled;

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Staffing", href: "/staffing" },
    { name: "GCC Enablement", href: "/gcc-enablement" },
    { name: "Projects", href: "/service-based-projects" },
    { name: "Insights", href: "/insights" },
    { name: "Case Studies", href: "/case-studies" },
    { name: "Careers", href: "/careers" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

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
              src="/images/iilikia-groups.svg"
              alt="IILIKA GROUPS"
              width={150}
              height={50}
              className="h-12 w-auto"
              priority
            />
          </Link>

          <div className="hidden lg:flex items-center space-x-6">
            {navLinks.map((link) => (
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
            ))}
          </div>

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

        {isMenuOpen && (
          <div className={`lg:hidden py-4 border-t ${
            isTransparent ? "border-white/20 bg-black/30 backdrop-blur-sm" : "border-gray-200"
          }`}>
            {navLinks.map((link) => (
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
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}