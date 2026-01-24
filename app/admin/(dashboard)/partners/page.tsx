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

  const fetchPartners = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('partner_logos')
      .select('*')
      .order('display_order', { ascending: true })

    setPartners(data || [])
    setLoading(false)
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
