'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { Input, Select } from '@/components/admin/FormFields'
import ImageUpload from '@/components/admin/ImageUpload'
import { useAuth } from '@/lib/auth-context'

interface PartnerLogoForm {
  company_name: string
  logo_url: string | null
  website_url: string
  type: string
  display_order: number
  status: string
}

const initialForm: PartnerLogoForm = {
  company_name: '',
  logo_url: null,
  website_url: '',
  type: 'partner',
  display_order: 0,
  status: 'active',
}

export default function PartnerLogoEditPage() {
  const router = useRouter()
  const params = useParams()
  const isNew = params.id === 'new'
  const { user, loading: authLoading } = useAuth()

  const [form, setForm] = useState<PartnerLogoForm>(initialForm)
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPartnerLogo = useCallback(async () => {
    if (!user) return

    setLoading(true)
    try {
      const supabase = createClient()
      const { data, error: fetchError } = await supabase.from('partner_logos').select('*').eq('id', params.id).single()

      if (fetchError || !data) {
        router.push('/admin/partners')
        return
      }

      setForm({
        company_name: data.company_name,
        logo_url: data.logo_url,
        website_url: data.website_url || '',
        type: data.type,
        display_order: data.display_order,
        status: data.status,
      })
    } catch (err) {
      console.error('Error fetching partner logo:', err)
      setError('Failed to load partner logo')
    } finally {
      setLoading(false)
    }
  }, [user, params.id, router])

  useEffect(() => {
    if (!authLoading && user && !isNew) {
      fetchPartnerLogo()
    }
  }, [authLoading, user, isNew, fetchPartnerLogo])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!form.logo_url) {
      setError('Please upload a logo image')
      return
    }

    setSaving(true)

    const supabase = createClient()

    const payload = {
      company_name: form.company_name,
      logo_url: form.logo_url,
      website_url: form.website_url || null,
      type: form.type,
      display_order: form.display_order,
      status: form.status,
    }

    const { error } = isNew
      ? await supabase.from('partner_logos').insert(payload)
      : await supabase.from('partner_logos').update(payload).eq('id', params.id)

    if (error) {
      setError(error.message)
      setSaving(false)
      return
    }

    router.push('/admin/partners')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#FF000E] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Link href="/admin/partners" className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 mb-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Partner Logos
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">{isNew ? 'Add Logo' : 'Edit Logo'}</h1>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
        <Input label="Company Name" value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })} required placeholder="Acme Inc." />

        <ImageUpload label="Logo Image" bucket="logos" value={form.logo_url} onChange={(url) => setForm({ ...form, logo_url: url })} error={!form.logo_url ? 'Logo is required' : undefined} />

        <Input label="Website URL" value={form.website_url} onChange={(e) => setForm({ ...form, website_url: e.target.value })} placeholder="https://..." />

        <div className="grid grid-cols-3 gap-4">
          <Select
            label="Type"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            required
            options={[
              { value: 'client', label: 'Client' },
              { value: 'partner', label: 'Partner' },
              { value: 'technology', label: 'Technology' },
            ]}
          />
          <Input label="Display Order" type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })} min={0} />
          <Select
            label="Status"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            options={[
              { value: 'active', label: 'Active' },
              { value: 'archived', label: 'Archived' },
            ]}
          />
        </div>

        <div className="flex items-center gap-3 pt-4 border-t">
          <button type="submit" disabled={saving} className="px-6 py-2 bg-[#FF000E] text-white rounded hover:bg-[#9E0008] transition-colors disabled:opacity-50">
            {saving ? 'Saving...' : isNew ? 'Create Logo' : 'Save Changes'}
          </button>
          <Link href="/admin/partners" className="px-6 py-2 text-gray-700 hover:text-gray-900">Cancel</Link>
        </div>
      </form>
    </div>
  )
}
