'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import DataTable from '@/components/admin/DataTable'
import { StatusBadge } from '@/components/admin/FormFields'
import { useAuth } from '@/lib/auth-context'

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
  const [refreshing, setRefreshing] = useState(false)
  const { user, loading: authLoading } = useAuth()

  const fetchServices = useCallback(async (isRefresh = false) => {
    if (!user) return

    if (isRefresh) setRefreshing(true)
    else setLoading(true)

    try {
      const supabase = createClient()
      const { data } = await supabase
        .from('services')
        .select('*')
        .order('type', { ascending: false })
        .order('display_order', { ascending: true })

      setServices(data || [])
    } catch (err) {
      console.error('Error fetching services:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [user])

  useEffect(() => {
    if (!authLoading && user) {
      fetchServices()
    }
  }, [authLoading, user, fetchServices])

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
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchServices(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <svg className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
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
