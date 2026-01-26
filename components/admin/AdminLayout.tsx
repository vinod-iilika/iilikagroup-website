'use client'

import Sidebar from './Sidebar'
import AdminHeader from './Header'

// Middleware already protects /admin/* routes
// If you're here, you're authenticated
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
