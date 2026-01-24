'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'

interface DashboardStats {
  services: number
  products: number
  insights: number
  caseStudies: number
  testimonials: number
  teamMembers: number
  partnerLogos: number
  newInquiries: number
  newApplications: number
}

interface RecentSubmission {
  id: string
  type: 'inquiry' | 'application'
  name: string
  email: string
  created_at: string
  status: string
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentSubmissions, setRecentSubmissions] = useState<RecentSubmission[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()

      // Fetch counts for all tables
      const [
        servicesRes,
        productsRes,
        insightsRes,
        caseStudiesRes,
        testimonialsRes,
        teamRes,
        partnersRes,
        inquiriesRes,
        applicationsRes,
      ] = await Promise.all([
        supabase.from('services').select('id', { count: 'exact', head: true }),
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('insights').select('id', { count: 'exact', head: true }),
        supabase.from('case_studies').select('id', { count: 'exact', head: true }),
        supabase.from('testimonials').select('id', { count: 'exact', head: true }),
        supabase.from('team_members').select('id', { count: 'exact', head: true }),
        supabase.from('partner_logos').select('id', { count: 'exact', head: true }),
        supabase.from('client_inquiries').select('id', { count: 'exact', head: true }).eq('status', 'new'),
        supabase.from('general_applications').select('id', { count: 'exact', head: true }).eq('status', 'new'),
      ])

      setStats({
        services: servicesRes.count || 0,
        products: productsRes.count || 0,
        insights: insightsRes.count || 0,
        caseStudies: caseStudiesRes.count || 0,
        testimonials: testimonialsRes.count || 0,
        teamMembers: teamRes.count || 0,
        partnerLogos: partnersRes.count || 0,
        newInquiries: inquiriesRes.count || 0,
        newApplications: applicationsRes.count || 0,
      })

      // Fetch recent submissions
      const [recentInquiries, recentApps] = await Promise.all([
        supabase
          .from('client_inquiries')
          .select('id, contact_name, email, created_at, status')
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('general_applications')
          .select('id, name, email, created_at, status')
          .order('created_at', { ascending: false })
          .limit(5),
      ])

      const combined: RecentSubmission[] = [
        ...(recentInquiries.data || []).map((i) => ({
          id: i.id,
          type: 'inquiry' as const,
          name: i.contact_name,
          email: i.email,
          created_at: i.created_at,
          status: i.status,
        })),
        ...(recentApps.data || []).map((a) => ({
          id: a.id,
          type: 'application' as const,
          name: a.name,
          email: a.email,
          created_at: a.created_at,
          status: a.status,
        })),
      ]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5)

      setRecentSubmissions(combined)
      setLoading(false)
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#FF000E] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  const statCards = [
    { label: 'Services', value: stats?.services || 0, href: '/admin/services', color: 'bg-blue-500' },
    { label: 'Products', value: stats?.products || 0, href: '/admin/products', color: 'bg-purple-500' },
    { label: 'Insights', value: stats?.insights || 0, href: '/admin/insights', color: 'bg-green-500' },
    { label: 'Case Studies', value: stats?.caseStudies || 0, href: '/admin/case-studies', color: 'bg-orange-500' },
    { label: 'Testimonials', value: stats?.testimonials || 0, href: '/admin/testimonials', color: 'bg-pink-500' },
    { label: 'Team Members', value: stats?.teamMembers || 0, href: '/admin/team', color: 'bg-indigo-500' },
    { label: 'Partner Logos', value: stats?.partnerLogos || 0, href: '/admin/partners', color: 'bg-teal-500' },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to the IILIKA GROUPS admin panel</p>
      </div>

      {/* Alert Cards for New Submissions */}
      {((stats?.newInquiries || 0) > 0 || (stats?.newApplications || 0) > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(stats?.newInquiries || 0) > 0 && (
            <Link href="/admin/inquiries" className="block">
              <div className="bg-[#FF000E] text-white rounded-lg p-4 hover:bg-[#9E0008] transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">New Client Inquiries</p>
                    <p className="text-3xl font-bold">{stats?.newInquiries}</p>
                  </div>
                  <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </Link>
          )}
          {(stats?.newApplications || 0) > 0 && (
            <Link href="/admin/applications" className="block">
              <div className="bg-gray-900 text-white rounded-lg p-4 hover:bg-gray-800 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">New Applications</p>
                    <p className="text-3xl font-bold">{stats?.newApplications}</p>
                  </div>
                  <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
            </Link>
          )}
        </div>
      )}

      {/* Content Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {statCards.map((stat) => (
          <Link key={stat.label} href={stat.href} className="block">
            <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center mb-3`}>
                <span className="text-white font-bold">{stat.value}</span>
              </div>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Submissions */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Submissions</h2>
        </div>
        {recentSubmissions.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {recentSubmissions.map((submission) => (
              <Link
                key={`${submission.type}-${submission.id}`}
                href={submission.type === 'inquiry' ? '/admin/inquiries' : '/admin/applications'}
                className="block p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        submission.type === 'inquiry'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {submission.type === 'inquiry' ? 'Inquiry' : 'Application'}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">{submission.name}</p>
                      <p className="text-sm text-gray-500">{submission.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        submission.status === 'new'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {submission.status}
                    </span>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(submission.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <p>No submissions yet</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/services/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Service
          </Link>
          <Link
            href="/admin/insights/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Blog Post
          </Link>
          <Link
            href="/admin/testimonials/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Testimonial
          </Link>
          <Link
            href="/admin/case-studies/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Case Study
          </Link>
        </div>
      </div>
    </div>
  )
}
