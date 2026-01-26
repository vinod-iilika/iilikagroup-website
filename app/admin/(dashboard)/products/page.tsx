'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import DataTable from '@/components/admin/DataTable'
import { StatusBadge } from '@/components/admin/FormFields'

interface Product {
  id: string
  slug: string
  title: string
  tagline: string | null
  type: string
  client_name: string | null
  featured: boolean
  display_order: number
  status: string
  created_at: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data } = await supabase
        .from('products')
        .select('*')
        .order('display_order', { ascending: true })
      setProducts(data || [])
    } catch (err) {
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    const supabase = createClient()
    await supabase.from('products').delete().eq('id', id)
    fetchProducts()
  }

  const columns = [
    {
      key: 'title',
      label: 'Product',
      render: (item: Product) => (
        <div>
          <p className="font-medium">{item.title}</p>
          <p className="text-xs text-gray-500">{item.tagline}</p>
        </div>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      render: (item: Product) => (
        <span className={`px-2 py-1 text-xs rounded capitalize ${
          item.type === 'internal' ? 'bg-purple-100 text-purple-700' :
          item.type === 'client' ? 'bg-blue-100 text-blue-700' :
          'bg-green-100 text-green-700'
        }`}>
          {item.type}
        </span>
      ),
    },
    {
      key: 'featured',
      label: 'Featured',
      render: (item: Product) => item.featured ? '⭐' : '-',
    },
    {
      key: 'status',
      label: 'Status',
      render: (item: Product) => <StatusBadge status={item.status} />,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600">Manage product showcase</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchProducts}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {loading ? 'Loading...' : 'Refresh'}
          </button>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF000E] text-white rounded hover:bg-[#9E0008] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Product
          </Link>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={products}
        basePath="/admin/products"
        onDelete={handleDelete}
        loading={loading}
      />
    </div>
  )
}
