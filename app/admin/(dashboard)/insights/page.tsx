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

  const fetchInsights = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('insights')
      .select('*, team_members(name)')
      .order('created_at', { ascending: false })

    setInsights(data || [])
    setLoading(false)
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

      <DataTable
        columns={columns}
        data={insights}
        basePath="/admin/insights"
        onDelete={handleDelete}
        loading={loading}
      />
    </div>
  )
}
