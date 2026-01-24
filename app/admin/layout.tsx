import { AuthProvider } from '@/lib/auth-context'

export const metadata = {
  title: 'Admin | IILIKA GROUPS',
  description: 'IILIKA GROUPS Admin Panel',
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
