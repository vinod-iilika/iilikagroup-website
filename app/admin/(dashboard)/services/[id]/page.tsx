'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { Input, Textarea, Select, TagInput } from '@/components/admin/FormFields'

interface ServiceForm {
  slug: string
  title: string
  description: string
  type: string
  parent_id: string | null
  icon_name: string
  icon_url: string
  display_order: number
  status: string
  seo_title: string
  seo_description: string
  seo_keywords: string[]
}

const initialForm: ServiceForm = {
  slug: '',
  title: '',
  description: '',
  type: 'offering',
  parent_id: null,
  icon_name: '',
  icon_url: '',
  display_order: 0,
  status: 'draft',
  seo_title: '',
  seo_description: '',
  seo_keywords: [],
}

export default function ServiceEditPage() {
  const router = useRouter()
  const params = useParams()
  const isNew = params.id === 'new'

  const [form, setForm] = useState<ServiceForm>(initialForm)
  const [pillars, setPillars] = useState<{ id: string; title: string }[]>([])
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [slugTouched, setSlugTouched] = useState(!isNew)
  const [slugError, setSlugError] = useState<string | null>(null)

  const fetchPillars = useCallback(async () => {
    try {
      const supabase = createClient()
      const { data } = await supabase
        .from('services')
        .select('id, title')
        .eq('type', 'pillar')
        .order('display_order')
      setPillars(data || [])
    } catch (err) {
      console.error('Error fetching pillars:', err)
    }
  }, [])

  const fetchService = useCallback(async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data, error: fetchError } = await supabase
        .from('services')
        .select('*')
        .eq('id', params.id)
        .single()

      if (fetchError || !data) {
        router.push('/admin/services')
        return
      }

      setForm({
        slug: data.slug,
        title: data.title,
        description: data.description || '',
        type: data.type,
        parent_id: data.parent_id,
        icon_name: data.icon_name || '',
        icon_url: data.icon_url || '',
        display_order: data.display_order,
        status: data.status,
        seo_title: data.seo_title || '',
        seo_description: data.seo_description || '',
        seo_keywords: data.seo_keywords || [],
      })
    } catch (err) {
      console.error('Error fetching service:', err)
      setError('Failed to load service')
    } finally {
      setLoading(false)
    }
  }, [params.id, router])

  useEffect(() => {
    fetchPillars()
    if (!isNew) {
      fetchService()
    }
  }, [isNew, fetchPillars, fetchService])

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const checkSlugUnique = async (slug: string) => {
    if (!slug) { setSlugError(null); return true }
    const supabase = createClient()
    let query = supabase.from('services').select('id').eq('slug', slug)
    if (!isNew) query = query.neq('id', params.id)
    const { data } = await query
    if (data && data.length > 0) {
      setSlugError('This slug is already in use')
      return false
    }
    setSlugError(null)
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSaving(true)

    const finalSlug = form.slug || generateSlug(form.title)
    const isUnique = await checkSlugUnique(finalSlug)
    if (!isUnique) { setSaving(false); return }

    const supabase = createClient()

    const payload = {
      slug: finalSlug,
      title: form.title,
      description: form.description || null,
      type: form.type,
      parent_id: form.type === 'offering' ? form.parent_id : null,
      icon_name: form.icon_name || null,
      icon_url: form.icon_url || null,
      display_order: form.display_order,
      status: form.status,
      seo_title: form.seo_title || null,
      seo_description: form.seo_description || null,
      seo_keywords: form.seo_keywords,
    }

    if (isNew) {
      const { error } = await supabase.from('services').insert(payload)
      if (error) {
        setError(error.message)
        setSaving(false)
        return
      }
    } else {
      const { error } = await supabase.from('services').update(payload).eq('id', params.id)
      if (error) {
        setError(error.message)
        setSaving(false)
        return
      }
    }

    router.push('/admin/services')
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
        <Link href="/admin/services" className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 mb-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Services
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          {isNew ? 'Add Service' : 'Edit Service'}
        </h1>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
        <Input
          label="Title"
          value={form.title}
          onChange={(e) => {
            const title = e.target.value
            setForm({ ...form, title, ...(!slugTouched ? { slug: generateSlug(title) } : {}) })
          }}
          required
          placeholder="Service Title"
        />

        <Input
          label="Slug"
          value={form.slug}
          onChange={(e) => {
            setSlugTouched(true)
            setSlugError(null)
            setForm({ ...form, slug: e.target.value })
          }}
          onBlur={() => checkSlugUnique(form.slug)}
          error={slugError || undefined}
          placeholder="auto-generated-from-title"
        />

        <Textarea
          label="Description (Markdown supported)"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Describe this service..."
          rows={6}
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Type"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            required
            options={[
              { value: 'pillar', label: 'Pillar (Top-level)' },
              { value: 'offering', label: 'Offering (Sub-service)' },
            ]}
          />
          {form.type === 'offering' && (
            <Select
              label="Parent Pillar"
              value={form.parent_id || ''}
              onChange={(e) => setForm({ ...form, parent_id: e.target.value || null })}
              options={pillars.map((p) => ({ value: p.id, label: p.title }))}
            />
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Icon Name (Lucide)"
            value={form.icon_name}
            onChange={(e) => setForm({ ...form, icon_name: e.target.value })}
            placeholder="users, building, briefcase"
          />
          <Input
            label="Display Order"
            type="number"
            value={form.display_order}
            onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })}
            min={0}
          />
        </div>

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

        <div className="border-t pt-6">
          <h3 className="font-medium text-gray-900 mb-4">SEO Settings</h3>
          <div className="space-y-4">
            <Input
              label="SEO Title"
              value={form.seo_title}
              onChange={(e) => setForm({ ...form, seo_title: e.target.value })}
              placeholder="Custom title for search engines"
            />
            <Textarea
              label="SEO Description"
              value={form.seo_description}
              onChange={(e) => setForm({ ...form, seo_description: e.target.value })}
              placeholder="Meta description (150-160 characters)"
              rows={2}
            />
            <TagInput
              label="SEO Keywords"
              value={form.seo_keywords}
              onChange={(tags) => setForm({ ...form, seo_keywords: tags })}
              placeholder="Add keyword..."
            />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t">
          <button
            type="submit"
            disabled={saving || !!slugError}
            className="px-6 py-2 bg-[#FF000E] text-white rounded hover:bg-[#9E0008] transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : isNew ? 'Create Service' : 'Save Changes'}
          </button>
          <Link href="/admin/services" className="px-6 py-2 text-gray-700 hover:text-gray-900">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
