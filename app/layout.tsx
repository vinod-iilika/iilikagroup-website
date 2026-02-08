import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import LayoutShell from "@/components/layout/LayoutShell";

const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });

export const metadata: Metadata = {
  title: "IILIKA GROUPS - IT Staffing, GCC Enablement & Project Delivery",
  description: "Staffing, GCC enablement, and project delivery for modern enterprises. Building teams and GCCs that deliver.",
  icons: {
    icon: "/images/iilikia-groups.svg",
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
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
