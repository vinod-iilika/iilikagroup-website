'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import DataTable from '@/components/admin/DataTable'
import { StatusBadge } from '@/components/admin/FormFields'

interface Testimonial {
  id: string
  client_name: string
  company: string | null
  position: string | null
  quote: string
  logo_url: string | null
  display_order: number
  status: string
  created_at: string
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  const fetchTestimonials = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('testimonials')
      .select('*')
      .order('display_order', { ascending: true })

    setTestimonials(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return

    const supabase = createClient()
    await supabase.from('testimonials').delete().eq('id', id)
    fetchTestimonials()
  }

  const columns = [
    {
      key: 'client_name',
      label: 'Client',
      render: (item: Testimonial) => (
        <div className="flex items-center gap-3">
          {item.logo_url && (
            <img src={item.logo_url} alt="" className="w-8 h-8 rounded object-contain" />
          )}
          <div>
            <p className="font-medium">{item.client_name}</p>
            <p className="text-xs text-gray-500">
              {item.position && `${item.position}`}
              {item.position && item.company && ' at '}
              {item.company}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'quote',
      label: 'Quote',
      render: (item: Testimonial) => (
        <p className="max-w-md truncate text-gray-600">{item.quote}</p>
      ),
    },
    {
      key: 'display_order',
      label: 'Order',
    },
    {
      key: 'status',
      label: 'Status',
      render: (item: Testimonial) => <StatusBadge status={item.status} />,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Testimonials</h1>
          <p className="text-gray-600">Manage client testimonials for the website</p>
        </div>
        <Link
          href="/admin/testimonials/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF000E] text-white rounded hover:bg-[#9E0008] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Testimonial
        </Link>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={testimonials}
        basePath="/admin/testimonials"
        onDelete={handleDelete}
        loading={loading}
      />
    </div>
  )
}
