'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { Input, Textarea, Select, TagInput, Checkbox } from '@/components/admin/FormFields'
import ImageUpload from '@/components/admin/ImageUpload'

interface InsightForm {
  slug: string
  title: string
  excerpt: string
  content: string
  tags: string[]
  author_id: string | null
  cover_image_url: string | null
  featured: boolean
  status: string
  seo_title: string
  seo_description: string
  seo_keywords: string[]
}

const initialForm: InsightForm = {
  slug: '',
  title: '',
  excerpt: '',
  content: '',
  tags: [],
  author_id: null,
  cover_image_url: null,
  featured: false,
  status: 'draft',
  seo_title: '',
  seo_description: '',
  seo_keywords: [],
}

export default function InsightEditPage() {
  const router = useRouter()
  const params = useParams()
  const isNew = params.id === 'new'

  const [form, setForm] = useState<InsightForm>(initialForm)
  const [authors, setAuthors] = useState<{ id: string; name: string }[]>([])
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAuthors = useCallback(async () => {
    try {
      const supabase = createClient()
      const { data } = await supabase
        .from('team_members')
        .select('id, name')
        .eq('is_author', true)
        .eq('status', 'active')
        .order('name')
      setAuthors(data || [])
    } catch (err) {
      console.error('Error fetching authors:', err)
    }
  }, [])

  const fetchInsight = useCallback(async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data, error: fetchError } = await supabase.from('insights').select('*').eq('id', params.id).single()

      if (fetchError || !data) {
        router.push('/admin/insights')
        return
      }

      setForm({
        slug: data.slug,
        title: data.title,
        excerpt: data.excerpt || '',
        content: data.content,
        tags: data.tags || [],
        author_id: data.author_id,
        cover_image_url: data.cover_image_url,
        featured: data.featured,
        status: data.status,
        seo_title: data.seo_title || '',
        seo_description: data.seo_description || '',
        seo_keywords: data.seo_keywords || [],
      })
    } catch (err) {
      console.error('Error fetching insight:', err)
      setError('Failed to load insight')
    } finally {
      setLoading(false)
    }
  }, [params.id, router])

  useEffect(() => {
    fetchAuthors()
    if (!isNew) {
      fetchInsight()
    }
  }, [isNew, fetchAuthors, fetchInsight])

  const generateSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSaving(true)

    const supabase = createClient()

    const payload = {
      slug: form.slug || generateSlug(form.title),
      title: form.title,
      excerpt: form.excerpt || null,
      content: form.content,
      tags: form.tags,
      author_id: form.author_id,
      cover_image_url: form.cover_image_url,
      featured: form.featured,
      status: form.status,
      seo_title: form.seo_title || null,
      seo_description: form.seo_description || null,
      seo_keywords: form.seo_keywords,
    }

    const { error } = isNew
      ? await supabase.from('insights').insert(payload)
      : await supabase.from('insights').update(payload).eq('id', params.id)

    if (error) {
      setError(error.message)
      setSaving(false)
      return
    }

    router.push('/admin/insights')
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
        <Link href="/admin/insights" className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 mb-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Insights
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">{isNew ? 'Add Post' : 'Edit Post'}</h1>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
        <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="Post title" />

        <Input label="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated-from-title" />

        <Textarea label="Excerpt" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={2} placeholder="Short summary for cards..." />

        <Textarea label="Content (Markdown)" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required rows={15} placeholder="Write your post content here..." className="font-mono text-sm" />

        <TagInput label="Tags" value={form.tags} onChange={(tags) => setForm({ ...form, tags: tags })} placeholder="Add tag..." />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Author"
            value={form.author_id || ''}
            onChange={(e) => setForm({ ...form, author_id: e.target.value || null })}
            options={authors.map((a) => ({ value: a.id, label: a.name }))}
          />
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
        </div>

        <ImageUpload label="Cover Image" bucket="insights" value={form.cover_image_url} onChange={(url) => setForm({ ...form, cover_image_url: url })} />

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
          <button type="submit" disabled={saving} className="px-6 py-2 bg-[#FF000E] text-white rounded hover:bg-[#9E0008] transition-colors disabled:opacity-50">
            {saving ? 'Saving...' : isNew ? 'Create Post' : 'Save Changes'}
          </button>
          <Link href="/admin/insights" className="px-6 py-2 text-gray-700 hover:text-gray-900">Cancel</Link>
        </div>
      </form>
    </div>
  )
}
