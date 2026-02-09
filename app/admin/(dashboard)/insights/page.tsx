'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import DataTable from '@/components/admin/DataTable'
import { StatusBadge } from '@/components/admin/FormFields'

interface Insight {
  id: string
  slug: string
  title: string
  excerpt: string | null
  tags: string[]
  author_id: string | null
  featured: boolean
  status: string
  created_at: string
  team_members: { name: string } | null
}

export default function InsightsPage() {
  const [insights, setInsights] = useState<Insight[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const fetchInsights = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data } = await supabase
        .from('insights')
        .select('*, team_members(name)')
        .order('created_at', { ascending: false })
      setInsights(data || [])
    } catch (err) {
      console.error('Error fetching insights:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInsights()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return
    const supabase = createClient()
    await supabase.from('insights').delete().eq('id', id)
    fetchInsights()
  }

  const filteredInsights = insights.filter((item) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      if (
        !item.title.toLowerCase().includes(q) &&
        !(item.excerpt?.toLowerCase().includes(q) ?? false) &&
        !item.tags.some((t) => t.toLowerCase().includes(q))
      ) return false
    }
    if (statusFilter && item.status !== statusFilter) return false
    return true
  })

  const columns = [
    {
      key: 'title',
      label: 'Title',
      render: (item: Insight) => (
        <div>
          <p className="font-medium">{item.title}</p>
          <p className="text-xs text-gray-500 truncate max-w-xs">{item.excerpt}</p>
        </div>
      ),
    },
    {
      key: 'author',
      label: 'Author',
      render: (item: Insight) => item.team_members?.name || '-',
    },
    {
      key: 'tags',
      label: 'Tags',
      render: (item: Insight) => (
        <div className="flex flex-wrap gap-1">
          {item.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">{tag}</span>
          ))}
          {item.tags.length > 2 && <span className="text-xs text-gray-400">+{item.tags.length - 2}</span>}
        </div>
      ),
    },
    {
      key: 'featured',
      label: 'Featured',
      render: (item: Insight) => item.featured ? '⭐' : '-',
    },
    {
      key: 'status',
      label: 'Status',
      render: (item: Insight) => <StatusBadge status={item.status} />,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Insights</h1>
          <p className="text-gray-600">Manage blog posts and articles</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchInsights}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {loading ? 'Loading...' : 'Refresh'}
          </button>
          <Link
            href="/admin/insights/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF000E] text-white rounded hover:bg-[#9E0008] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Post
          </Link>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by title, excerpt, or tag..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF000E] focus:border-transparent text-sm" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF000E] text-sm">
          <option value="">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <DataTable
        columns={columns}
        data={filteredInsights}
        basePath="/admin/insights"
        onDelete={handleDelete}
        loading={loading}
      />
    </div>
  )
}
