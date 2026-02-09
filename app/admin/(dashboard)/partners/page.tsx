'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import DataTable from '@/components/admin/DataTable'
import { StatusBadge } from '@/components/admin/FormFields'

interface PartnerLogo {
  id: string
  company_name: string
  logo_url: string
  website_url: string | null
  type: string
  display_order: number
  status: string
}

export default function PartnersPage() {
  const [partners, setPartners] = useState<PartnerLogo[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')

  const fetchPartners = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data } = await supabase
        .from('partner_logos')
        .select('*')
        .order('display_order', { ascending: true })
      setPartners(data || [])
    } catch (err) {
      console.error('Error fetching partners:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPartners()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this logo?')) return
    const supabase = createClient()
    await supabase.from('partner_logos').delete().eq('id', id)
    fetchPartners()
  }

  const filteredPartners = partners.filter((item) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      if (!item.company_name.toLowerCase().includes(q)) return false
    }
    if (statusFilter && item.status !== statusFilter) return false
    if (typeFilter && item.type !== typeFilter) return false
    return true
  })

  const columns = [
    {
      key: 'company_name',
      label: 'Company',
      render: (item: PartnerLogo) => (
        <div className="flex items-center gap-3">
          <img src={item.logo_url} alt="" className="w-12 h-8 object-contain" />
          <span className="font-medium">{item.company_name}</span>
        </div>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      render: (item: PartnerLogo) => (
        <span className={`px-2 py-1 text-xs rounded capitalize ${
          item.type === 'client' ? 'bg-blue-100 text-blue-700' :
          item.type === 'partner' ? 'bg-green-100 text-green-700' :
          'bg-purple-100 text-purple-700'
        }`}>
          {item.type}
        </span>
      ),
    },
    {
      key: 'display_order',
      label: 'Order',
    },
    {
      key: 'status',
      label: 'Status',
      render: (item: PartnerLogo) => <StatusBadge status={item.status} />,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Partner Logos</h1>
          <p className="text-gray-600">Manage client, partner, and technology logos</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchPartners}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {loading ? 'Loading...' : 'Refresh'}
          </button>
          <Link
            href="/admin/partners/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF000E] text-white rounded hover:bg-[#9E0008] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Logo
          </Link>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by company name..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF000E] focus:border-transparent text-sm" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF000E] text-sm">
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </select>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF000E] text-sm">
          <option value="">All Types</option>
          <option value="client">Client</option>
          <option value="partner">Partner</option>
          <option value="technology">Technology</option>
        </select>
      </div>

      <DataTable
        columns={columns}
        data={filteredPartners}
        basePath="/admin/partners"
        onDelete={handleDelete}
        loading={loading}
      />
    </div>
  )
}
