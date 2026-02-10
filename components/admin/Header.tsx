'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

const pathLabels: Record<string, string> = {
  admin: 'Dashboard',
  services: 'Services',
  products: 'Products',
  insights: 'Insights',
  'case-studies': 'Case Studies',
  testimonials: 'Testimonials',
  team: 'Team Members',
  partners: 'Partner Logos',
  'job-openings': 'Job Openings',
  inquiries: 'Client Inquiries',
  applications: 'Applications',
  storage: 'Storage',
  new: 'New',
}

interface AdminHeaderProps {
  onMenuToggle: () => void
}

export default function AdminHeader({ onMenuToggle }: AdminHeaderProps) {
  const { adminProfile, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const handleSignOut = async () => {
    await signOut()
    router.push('/admin/login')
  }

  // Build breadcrumbs from pathname
  const buildBreadcrumbs = () => {
    const segments = pathname.split('/').filter(Boolean)
    const crumbs: { label: string; href: string }[] = []

    let currentPath = ''
    for (let i = 0; i < segments.length; i++) {
      currentPath += `/${segments[i]}`
      const segment = segments[i]
      const label = pathLabels[segment] || (
        // UUID-like strings are "Edit" pages
        segment.length > 20 ? 'Edit' : segment.charAt(0).toUpperCase() + segment.slice(1)
      )
      crumbs.push({ label, href: currentPath })
    }

    return crumbs
  }

  const breadcrumbs = buildBreadcrumbs()

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Mobile hamburger */}
          <button
            onClick={onMenuToggle}
            className="lg:hidden text-gray-600 hover:text-gray-900"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Breadcrumbs */}
          <nav className="flex items-center text-sm text-gray-500">
            {breadcrumbs.map((crumb, index) => (
              <span key={crumb.href} className="flex items-center">
                {index > 0 && (
                  <svg className="w-4 h-4 mx-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
                {index === breadcrumbs.length - 1 ? (
                  <span className="font-medium text-gray-900">{crumb.label}</span>
                ) : (
                  <Link href={crumb.href} className="hover:text-gray-700">
                    {crumb.label}
                  </Link>
                )}
              </span>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {/* View Site Link */}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            <span className="hidden sm:inline">View Site</span>
          </a>

          {/* User Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900">
              <span className="hidden sm:inline">{adminProfile?.full_name || 'Admin'}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="py-1">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{adminProfile?.full_name}</p>
                  <p className="text-xs text-gray-500">{adminProfile?.email}</p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
