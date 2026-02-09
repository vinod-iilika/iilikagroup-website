'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { Input, Textarea, Select, TagInput, Checkbox } from '@/components/admin/FormFields'
import ImageUpload from '@/components/admin/ImageUpload'

interface ProductForm {
  slug: string
  title: string
  tagline: string
  description: string
  type: string
  client_name: string
  features: string[]
  technologies: string[]
  image_url: string | null
  external_url: string
  display_order: number
  featured: boolean
  status: string
  seo_title: string
  seo_description: string
  seo_keywords: string[]
}

const initialForm: ProductForm = {
  slug: '',
  title: '',
  tagline: '',
  description: '',
  type: 'internal',
  client_name: '',
  features: [],
  technologies: [],
  image_url: null,
  external_url: '',
  display_order: 0,
  featured: false,
  status: 'draft',
  seo_title: '',
  seo_description: '',
  seo_keywords: [],
}

export default function ProductEditPage() {
  const router = useRouter()
  const params = useParams()
  const isNew = params.id === 'new'

  const [form, setForm] = useState<ProductForm>(initialForm)
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [slugTouched, setSlugTouched] = useState(!isNew)
  const [slugError, setSlugError] = useState<string | null>(null)

  const fetchProduct = useCallback(async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data, error: fetchError } = await supabase.from('products').select('*').eq('id', params.id).single()

      if (fetchError || !data) {
        router.push('/admin/products')
        return
      }

      setForm({
        slug: data.slug,
        title: data.title,
        tagline: data.tagline || '',
        description: data.description || '',
        type: data.type,
        client_name: data.client_name || '',
        features: data.features || [],
        technologies: data.technologies || [],
        image_url: data.image_url,
        external_url: data.external_url || '',
        display_order: data.display_order,
        featured: data.featured,
        status: data.status,
        seo_title: data.seo_title || '',
        seo_description: data.seo_description || '',
        seo_keywords: data.seo_keywords || [],
      })
    } catch (err) {
      console.error('Error fetching product:', err)
      setError('Failed to load product')
    } finally {
      setLoading(false)
    }
  }, [params.id, router])

  useEffect(() => {
    if (!isNew) {
      fetchProduct()
    }
  }, [isNew, fetchProduct])

  const generateSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  const checkSlugUnique = async (slug: string) => {
    if (!slug) { setSlugError(null); return true }
    const supabase = createClient()
    let query = supabase.from('products').select('id').eq('slug', slug)
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
      tagline: form.tagline || null,
      description: form.description || null,
      type: form.type,
      client_name: form.type === 'client' ? form.client_name || null : null,
      features: form.features,
      technologies: form.technologies,
      image_url: form.image_url,
      external_url: form.external_url || null,
      display_order: form.display_order,
      featured: form.featured,
      status: form.status,
      seo_title: form.seo_title || null,
      seo_description: form.seo_description || null,
      seo_keywords: form.seo_keywords,
    }

    const { error } = isNew
      ? await supabase.from('products').insert(payload)
      : await supabase.from('products').update(payload).eq('id', params.id)

    if (error) {
      setError(error.message)
      setSaving(false)
      return
    }

    router.push('/admin/products')
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
        <Link href="/admin/products" className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 mb-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Products
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">{isNew ? 'Add Product' : 'Edit Product'}</h1>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
        <Input label="Title" value={form.title} onChange={(e) => {
          const title = e.target.value
          setForm({ ...form, title, ...(!slugTouched ? { slug: generateSlug(title) } : {}) })
        }} required placeholder="Product Name" />

        <Input label="Slug" value={form.slug} onChange={(e) => {
          setSlugTouched(true)
          setSlugError(null)
          setForm({ ...form, slug: e.target.value })
        }} onBlur={() => checkSlugUnique(form.slug)} error={slugError || undefined} placeholder="auto-generated-from-title" />

        <Input label="Tagline" value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} placeholder="Short one-liner" />

        <Textarea label="Description (Markdown)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={6} placeholder="Full product description..." />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Type"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            required
            options={[
              { value: 'internal', label: 'Internal (Our Product)' },
              { value: 'client', label: 'Client (Delivered)' },
              { value: 'partner', label: 'Partner (Tools We Use)' },
            ]}
          />
          {form.type === 'client' && (
            <Input label="Client Name" value={form.client_name} onChange={(e) => setForm({ ...form, client_name: e.target.value })} placeholder="Client company name" />
          )}
        </div>

        <TagInput label="Features" value={form.features} onChange={(tags) => setForm({ ...form, features: tags })} placeholder="Add feature..." />

        <TagInput label="Technologies" value={form.technologies} onChange={(tags) => setForm({ ...form, technologies: tags })} placeholder="Add technology..." />

        <ImageUpload label="Product Image" bucket="products" value={form.image_url} onChange={(url) => setForm({ ...form, image_url: url })} />

        <Input label="External URL" value={form.external_url} onChange={(e) => setForm({ ...form, external_url: e.target.value })} placeholder="https://..." />

        <div className="grid grid-cols-2 gap-4">
          <Input label="Display Order" type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })} min={0} />
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

        <Checkbox label="Featured on homepage" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />

        <div className="border-t pt-6">
          <h3 className="font-medium text-gray-900 mb-4">SEO Settings</h3>
          <div className="space-y-4">
            <Input label="SEO Title" value={form.seo_title} onChange={(e) => setForm({ ...form, seo_title: e.target.value })} />
            <Textarea label="SEO Description" value={form.seo_description} onChange={(e) => setForm({ ...form, seo_description: e.target.value })} rows={2} />
            <TagInput label="SEO Keywords" value={form.seo_keywords} onChange={(tags) => setForm({ ...form, seo_keywords: tags })} />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t">
          <button type="submit" disabled={saving || !!slugError} className="px-6 py-2 bg-[#FF000E] text-white rounded hover:bg-[#9E0008] transition-colors disabled:opacity-50">
            {saving ? 'Saving...' : isNew ? 'Create Product' : 'Save Changes'}
          </button>
          <Link href="/admin/products" className="px-6 py-2 text-gray-700 hover:text-gray-900">Cancel</Link>
        </div>
      </form>
    </div>
  )
}
