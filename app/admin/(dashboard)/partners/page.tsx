'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import DataTable from '@/components/admin/DataTable'
import { StatusBadge } from '@/components/admin/FormFields'
import { useAuth } from '@/lib/auth-context'

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
  const [refreshing, setRefreshing] = useState(false)
  const { user, loading: authLoading } = useAuth()

  const fetchPartners = useCallback(async (isRefresh = false) => {
    if (!user) return

    if (isRefresh) setRefreshing(true)
    else setLoading(true)

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
      setRefreshing(false)
    }
  }, [user])

  useEffect(() => {
    if (!authLoading && user) {
      fetchPartners()
    }
  }, [authLoading, user, fetchPartners])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this logo?')) return
    const supabase = createClient()
    await supabase.from('partner_logos').delete().eq('id', id)
    fetchPartners()
  }

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
            onClick={() => fetchPartners(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <svg className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {refreshing ? 'Refreshing...' : 'Refresh'}
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

      <DataTable
        columns={columns}
        data={partners}
        basePath="/admin/partners"
        onDelete={handleDelete}
        loading={loading}
      />
    </div>
  )
}
