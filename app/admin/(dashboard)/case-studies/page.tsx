'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import DataTable from '@/components/admin/DataTable'
import { StatusBadge } from '@/components/admin/FormFields'

interface CaseStudy {
  id: string
  slug: string
  title: string
  client_name: string | null
  industry: string | null
  featured: boolean
  status: string
  created_at: string
}

export default function CaseStudiesPage() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([])
  const [loading, setLoading] = useState(true)

  const fetchCaseStudies = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('case_studies')
      .select('*')
      .order('created_at', { ascending: false })

    setCaseStudies(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchCaseStudies()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this case study?')) return
    const supabase = createClient()
    await supabase.from('case_studies').delete().eq('id', id)
    fetchCaseStudies()
  }

  const columns = [
    {
      key: 'title',
      label: 'Title',
      render: (item: CaseStudy) => (
        <div>
          <p className="font-medium">{item.title}</p>
          <p className="text-xs text-gray-500">{item.client_name || 'Anonymous'}</p>
        </div>
      ),
    },
    {
      key: 'industry',
      label: 'Industry',
      render: (item: CaseStudy) => item.industry || '-',
    },
    {
      key: 'featured',
      label: 'Featured',
      render: (item: CaseStudy) => item.featured ? '⭐' : '-',
    },
    {
      key: 'status',
      label: 'Status',
      render: (item: CaseStudy) => <StatusBadge status={item.status} />,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Case Studies</h1>
          <p className="text-gray-600">Manage client success stories</p>
        </div>
        <Link
          href="/admin/case-studies/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF000E] text-white rounded hover:bg-[#9E0008] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Case Study
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={caseStudies}
        basePath="/admin/case-studies"
        onDelete={handleDelete}
        loading={loading}
      />
    </div>
  )
}
