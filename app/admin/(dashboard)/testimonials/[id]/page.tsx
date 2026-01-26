'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { Input, Textarea, Select } from '@/components/admin/FormFields'
import ImageUpload from '@/components/admin/ImageUpload'

interface TestimonialForm {
  client_name: string
  company: string
  position: string
  quote: string
  logo_url: string | null
  display_order: number
  status: string
}

const initialForm: TestimonialForm = {
  client_name: '',
  company: '',
  position: '',
  quote: '',
  logo_url: null,
  display_order: 0,
  status: 'draft',
}

export default function TestimonialEditPage() {
  const router = useRouter()
  const params = useParams()
  const isNew = params.id === 'new'

  const [form, setForm] = useState<TestimonialForm>(initialForm)
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTestimonial = useCallback(async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data, error: fetchError } = await supabase
        .from('testimonials')
        .select('*')
        .eq('id', params.id)
        .single()

      if (fetchError || !data) {
        router.push('/admin/testimonials')
        return
      }

      setForm({
        client_name: data.client_name,
        company: data.company || '',
        position: data.position || '',
        quote: data.quote,
        logo_url: data.logo_url,
        display_order: data.display_order,
        status: data.status,
      })
    } catch (err) {
      console.error('Error fetching testimonial:', err)
      setError('Failed to load testimonial')
    } finally {
      setLoading(false)
    }
  }, [params.id, router])

  useEffect(() => {
    if (!isNew) {
      fetchTestimonial()
    }
  }, [isNew, fetchTestimonial])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSaving(true)

    const supabase = createClient()

    const payload = {
      client_name: form.client_name,
      company: form.company || null,
      position: form.position || null,
      quote: form.quote,
      logo_url: form.logo_url,
      display_order: form.display_order,
      status: form.status,
    }

    if (isNew) {
      const { error } = await supabase.from('testimonials').insert(payload)
      if (error) {
        setError(error.message)
        setSaving(false)
        return
      }
    } else {
      const { error } = await supabase
        .from('testimonials')
        .update(payload)
        .eq('id', params.id)
      if (error) {
        setError(error.message)
        setSaving(false)
        return
      }
    }

    router.push('/admin/testimonials')
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
      {/* Page Header */}
      <div className="mb-6">
        <Link
          href="/admin/testimonials"
          className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 mb-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Testimonials
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          {isNew ? 'Add Testimonial' : 'Edit Testimonial'}
        </h1>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
        <Input
          label="Client Name"
          value={form.client_name}
          onChange={(e) => setForm({ ...form, client_name: e.target.value })}
          required
          placeholder="John Doe"
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Position"
            value={form.position}
            onChange={(e) => setForm({ ...form, position: e.target.value })}
            placeholder="CTO"
          />
          <Input
            label="Company"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            placeholder="Acme Inc."
          />
        </div>

        <Textarea
          label="Quote"
          value={form.quote}
          onChange={(e) => setForm({ ...form, quote: e.target.value })}
          required
          placeholder="What the client said about your services..."
          rows={4}
        />

        <ImageUpload
          label="Company Logo (optional)"
          bucket="logos"
          value={form.logo_url}
          onChange={(url) => setForm({ ...form, logo_url: url })}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Display Order"
            type="number"
            value={form.display_order}
            onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })}
            min={0}
          />
          <Select
            label="Status"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            options={[
              { value: 'draft', label: 'Draft' },
              { value: 'active', label: 'Active' },
              { value: 'archived', label: 'Archived' },
            ]}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-4 border-t">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-[#FF000E] text-white rounded hover:bg-[#9E0008] transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : isNew ? 'Create Testimonial' : 'Save Changes'}
          </button>
          <Link
            href="/admin/testimonials"
            className="px-6 py-2 text-gray-700 hover:text-gray-900"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
