'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

const menuItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    title: 'Content',
    items: [
      { title: 'Services', href: '/admin/services' },
      { title: 'Products', href: '/admin/products' },
      { title: 'Insights', href: '/admin/insights' },
      { title: 'Case Studies', href: '/admin/case-studies' },
      { title: 'Testimonials', href: '/admin/testimonials' },
      { title: 'Team Members', href: '/admin/team' },
      { title: 'Partner Logos', href: '/admin/partners' },
      { title: 'Job Openings', href: '/admin/job-openings' },
    ],
  },
  {
    title: 'Submissions',
    items: [
      { title: 'Client Inquiries', href: '/admin/inquiries' },
      { title: 'Applications', href: '/admin/applications' },
    ],
  },
  {
    title: 'Storage',
    href: '/admin/storage',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const { adminProfile } = useAuth()

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin'
    }
    return pathname.startsWith(href)
  }

  const handleNavClick = () => {
    onClose()
  }

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white flex flex-col
        transform transition-transform duration-200 ease-in-out
        lg:static lg:z-auto lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3" onClick={handleNavClick}>
            <Image src="/images/iilika-groups.svg" alt="IILIKA GROUPS" width={100} height={32} className="h-8 w-auto" />
            <span className="text-xs bg-[#FF000E] px-2 py-0.5 rounded">ADMIN</span>
          </Link>
          {/* Mobile close button */}
          <button
            onClick={onClose}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item, index) => (
            <div key={index}>
              {item.href ? (
                <Link
                  href={item.href}
                  onClick={handleNavClick}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                    isActive(item.href)
                      ? 'bg-[#FF000E] text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              ) : (
                <div className="mt-6 mb-2">
                  <span className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {item.title}
                  </span>
                  <div className="mt-2 space-y-1">
                    {item.items?.map((subItem) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        onClick={handleNavClick}
                        className={`block px-4 py-2 rounded-lg transition-colors ${
                          isActive(subItem.href)
                            ? 'bg-[#FF000E] text-white'
                            : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                        }`}
                      >
                        {subItem.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
              <span className="text-sm font-semibold">
                {adminProfile?.full_name?.charAt(0) || 'A'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {adminProfile?.full_name || 'Admin'}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {adminProfile?.role || 'admin'}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
