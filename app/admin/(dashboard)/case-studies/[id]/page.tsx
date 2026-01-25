'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { Input, Textarea, Select, TagInput, Checkbox } from '@/components/admin/FormFields'
import ImageUpload from '@/components/admin/ImageUpload'
import { useAuth } from '@/lib/auth-context'

interface CaseStudyForm {
  slug: string
  title: string
  client_name: string
  industry: string
  challenge: string
  solution: string
  results: string[]
  technologies: string[]
  thumbnail_url: string | null
  featured: boolean
  status: string
  seo_title: string
  seo_description: string
  seo_keywords: string[]
}

const initialForm: CaseStudyForm = {
  slug: '',
  title: '',
  client_name: '',
  industry: '',
  challenge: '',
  solution: '',
  results: [],
  technologies: [],
  thumbnail_url: null,
  featured: false,
  status: 'draft',
  seo_title: '',
  seo_description: '',
  seo_keywords: [],
}

export default function CaseStudyEditPage() {
  const router = useRouter()
  const params = useParams()
  const isNew = params.id === 'new'
  const { user, loading: authLoading } = useAuth()

  const [form, setForm] = useState<CaseStudyForm>(initialForm)
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCaseStudy = useCallback(async () => {
    if (!user) return

    setLoading(true)
    try {
      const supabase = createClient()
      const { data, error: fetchError } = await supabase.from('case_studies').select('*').eq('id', params.id).single()

      if (fetchError || !data) {
        router.push('/admin/case-studies')
        return
      }

      setForm({
        slug: data.slug,
        title: data.title,
        client_name: data.client_name || '',
        industry: data.industry || '',
        challenge: data.challenge,
        solution: data.solution,
        results: data.results || [],
        technologies: data.technologies || [],
        thumbnail_url: data.thumbnail_url,
        featured: data.featured,
        status: data.status,
        seo_title: data.seo_title || '',
        seo_description: data.seo_description || '',
        seo_keywords: data.seo_keywords || [],
      })
    } catch (err) {
      console.error('Error fetching case study:', err)
      setError('Failed to load case study')
    } finally {
      setLoading(false)
    }
  }, [user, params.id, router])

  useEffect(() => {
    if (!authLoading && user && !isNew) {
      fetchCaseStudy()
    }
  }, [authLoading, user, isNew, fetchCaseStudy])

  const generateSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSaving(true)

    const supabase = createClient()

    const payload = {
      slug: form.slug || generateSlug(form.title),
      title: form.title,
      client_name: form.client_name || null,
      industry: form.industry || null,
      challenge: form.challenge,
      solution: form.solution,
      results: form.results,
      technologies: form.technologies,
      thumbnail_url: form.thumbnail_url,
      featured: form.featured,
      status: form.status,
      seo_title: form.seo_title || null,
      seo_description: form.seo_description || null,
      seo_keywords: form.seo_keywords,
    }

    const { error } = isNew
      ? await supabase.from('case_studies').insert(payload)
      : await supabase.from('case_studies').update(payload).eq('id', params.id)

    if (error) {
      setError(error.message)
      setSaving(false)
      return
    }

    router.push('/admin/case-studies')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#FF000E] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <Link href="/admin/case-studies" className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 mb-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Case Studies
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">{isNew ? 'Add Case Study' : 'Edit Case Study'}</h1>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
        <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="Case Study Title" />

        <Input label="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated-from-title" />

        <div className="grid grid-cols-2 gap-4">
          <Input label="Client Name (optional)" value={form.client_name} onChange={(e) => setForm({ ...form, client_name: e.target.value })} placeholder="Can be anonymous" />
          <Input label="Industry" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} placeholder="fintech, healthcare, etc." />
        </div>

        <Textarea label="Challenge (Markdown)" value={form.challenge} onChange={(e) => setForm({ ...form, challenge: e.target.value })} required rows={6} placeholder="Describe the client's challenge..." />

        <Textarea label="Solution (Markdown)" value={form.solution} onChange={(e) => setForm({ ...form, solution: e.target.value })} required rows={6} placeholder="Describe how you solved it..." />

        <TagInput label="Results (Key Metrics)" value={form.results} onChange={(tags) => setForm({ ...form, results: tags })} placeholder="Add result metric..." />

        <TagInput label="Technologies Used" value={form.technologies} onChange={(tags) => setForm({ ...form, technologies: tags })} placeholder="Add technology..." />

        <ImageUpload label="Thumbnail Image" bucket="case-studies" value={form.thumbnail_url} onChange={(url) => setForm({ ...form, thumbnail_url: url })} />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Status"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            options={[
              { value: 'draft', label: 'Draft' },
              { value: 'published', label: 'Published' },
              { value: 'archived', label: 'Archived' },
            ]}
          />
          <div className="flex items-end">
            <Checkbox label="Featured on homepage" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="font-medium text-gray-900 mb-4">SEO Settings</h3>
          <div className="space-y-4">
            <Input label="SEO Title" value={form.seo_title} onChange={(e) => setForm({ ...form, seo_title: e.target.value })} />
            <Textarea label="SEO Description" value={form.seo_description} onChange={(e) => setForm({ ...form, seo_description: e.target.value })} rows={2} />
            <TagInput label="SEO Keywords" value={form.seo_keywords} onChange={(tags) => setForm({ ...form, seo_keywords: tags })} />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t">
          <button type="submit" disabled={saving} className="px-6 py-2 bg-[#FF000E] text-white rounded hover:bg-[#9E0008] transition-colors disabled:opacity-50">
            {saving ? 'Saving...' : isNew ? 'Create Case Study' : 'Save Changes'}
          </button>
          <Link href="/admin/case-studies" className="px-6 py-2 text-gray-700 hover:text-gray-900">Cancel</Link>
        </div>
      </form>
    </div>
  )
}
