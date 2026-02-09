import { AuthProvider } from '@/lib/auth-context'

export const metadata = {
  title: "Admin",
  description: "IILIKA GROUPS Admin Panel",
  robots: { index: false, follow: false },
}

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}
