'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import DataTable from '@/components/admin/DataTable'
import { StatusBadge } from '@/components/admin/FormFields'

interface Service {
  id: string
  slug: string
  title: string
  type: string
  parent_id: string | null
  icon_name: string | null
  display_order: number
  status: string
  created_at: string
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  const fetchServices = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('services')
      .select('*')
      .order('type', { ascending: false })
      .order('display_order', { ascending: true })

    setServices(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchServices()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return

    const supabase = createClient()
    await supabase.from('services').delete().eq('id', id)
    fetchServices()
  }

  const columns = [
    {
      key: 'title',
      label: 'Title',
      render: (item: Service) => (
        <div>
          <p className="font-medium">{item.title}</p>
          <p className="text-xs text-gray-500">/{item.slug}</p>
        </div>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      render: (item: Service) => (
        <span className={`px-2 py-1 text-xs rounded ${
          item.type === 'pillar' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
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
      render: (item: Service) => <StatusBadge status={item.status} />,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Services</h1>
          <p className="text-gray-600">Manage service pillars and offerings</p>
        </div>
        <Link
          href="/admin/services/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF000E] text-white rounded hover:bg-[#9E0008] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Service
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={services}
        basePath="/admin/services"
        onDelete={handleDelete}
        loading={loading}
      />
    </div>
  )
}
