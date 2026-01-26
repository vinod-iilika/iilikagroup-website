'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { Input, Textarea, Select, Checkbox } from '@/components/admin/FormFields'
import ImageUpload from '@/components/admin/ImageUpload'

interface TeamMemberForm {
  name: string
  position: string
  department: string
  bio: string
  photo_url: string | null
  linkedin_url: string
  email: string
  display_order: number
  is_author: boolean
  status: string
}

const initialForm: TeamMemberForm = {
  name: '',
  position: '',
  department: '',
  bio: '',
  photo_url: null,
  linkedin_url: '',
  email: '',
  display_order: 0,
  is_author: false,
  status: 'draft',
}

export default function TeamMemberEditPage() {
  const router = useRouter()
  const params = useParams()
  const isNew = params.id === 'new'

  const [form, setForm] = useState<TeamMemberForm>(initialForm)
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTeamMember = useCallback(async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data, error: fetchError } = await supabase.from('team_members').select('*').eq('id', params.id).single()

      if (fetchError || !data) {
        router.push('/admin/team')
        return
      }

      setForm({
        name: data.name,
        position: data.position,
        department: data.department || '',
        bio: data.bio || '',
        photo_url: data.photo_url,
        linkedin_url: data.linkedin_url || '',
        email: data.email || '',
        display_order: data.display_order,
        is_author: data.is_author,
        status: data.status,
      })
    } catch (err) {
      console.error('Error fetching team member:', err)
      setError('Failed to load team member')
    } finally {
      setLoading(false)
    }
  }, [params.id, router])

  useEffect(() => {
    if (!isNew) {
      fetchTeamMember()
    }
  }, [isNew, fetchTeamMember])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSaving(true)

    const supabase = createClient()

    const payload = {
      name: form.name,
      position: form.position,
      department: form.department || null,
      bio: form.bio || null,
      photo_url: form.photo_url,
      linkedin_url: form.linkedin_url || null,
      email: form.email || null,
      display_order: form.display_order,
      is_author: form.is_author,
      status: form.status,
    }

    const { error } = isNew
      ? await supabase.from('team_members').insert(payload)
      : await supabase.from('team_members').update(payload).eq('id', params.id)

    if (error) {
      setError(error.message)
      setSaving(false)
      return
    }

    router.push('/admin/team')
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
        <Link href="/admin/team" className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 mb-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Team
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">{isNew ? 'Add Team Member' : 'Edit Team Member'}</h1>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
        <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="John Doe" />

        <div className="grid grid-cols-2 gap-4">
          <Input label="Position" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} required placeholder="Software Engineer" />
          <Input label="Department" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} placeholder="Engineering" />
        </div>

        <Textarea label="Bio (Markdown)" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={4} placeholder="Short biography..." />

        <ImageUpload label="Photo" bucket="team" value={form.photo_url} onChange={(url) => setForm({ ...form, photo_url: url })} />

        <div className="grid grid-cols-2 gap-4">
          <Input label="LinkedIn URL" value={form.linkedin_url} onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })} placeholder="https://linkedin.com/in/..." />
          <Input label="Email (Public)" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="john@iilikagroups.com" />
        </div>

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

        <Checkbox label="Can write blog posts (Author)" checked={form.is_author} onChange={(e) => setForm({ ...form, is_author: e.target.checked })} />

        <div className="flex items-center gap-3 pt-4 border-t">
          <button type="submit" disabled={saving} className="px-6 py-2 bg-[#FF000E] text-white rounded hover:bg-[#9E0008] transition-colors disabled:opacity-50">
            {saving ? 'Saving...' : isNew ? 'Create Team Member' : 'Save Changes'}
          </button>
          <Link href="/admin/team" className="px-6 py-2 text-gray-700 hover:text-gray-900">Cancel</Link>
        </div>
      </form>
    </div>
  )
}
