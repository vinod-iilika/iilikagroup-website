import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import LayoutShell from "@/components/layout/LayoutShell";

const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });

export const metadata: Metadata = {
  metadataBase: new URL("https://iilikagroups.com"),
  title: {
    default: "IILIKA GROUPS - IT Staffing, GCC Enablement & Project Delivery",
    template: "%s | IILIKA GROUPS",
  },
  description:
    "Staffing, GCC enablement, and project delivery for modern enterprises. Building teams and GCCs that deliver.",
  icons: {
    icon: "/images/iilika-groups.svg",
  },
  openGraph: {
    type: "website",
    siteName: "IILIKA GROUPS",
    locale: "en_US",
    images: [{ url: "/images/iilika-groups-large.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "IILIKA GROUPS",
              url: "https://iilikagroups.com",
              logo: "https://iilikagroups.com/images/iilika-groups.svg",
              description:
                "IT Staffing, GCC Enablement & Project Delivery for modern enterprises.",
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer service",
              },
            }),
          }}
        />
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
