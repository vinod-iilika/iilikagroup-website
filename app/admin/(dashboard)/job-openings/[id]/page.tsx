'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { Input, Textarea, Select, TagInput } from '@/components/admin/FormFields'

interface JobOpeningForm {
  title: string
  department: string
  location: string
  experience: string
  employment_type: string
  description: string
  tech_stack: string[]
  display_order: number
  status: string
}

const initialForm: JobOpeningForm = {
  title: '',
  department: '',
  location: '',
  experience: '',
  employment_type: 'full-time',
  description: '',
  tech_stack: [],
  display_order: 0,
  status: 'draft',
}

export default function JobOpeningEditPage() {
  const router = useRouter()
  const params = useParams()
  const isNew = params.id === 'new'

  const [form, setForm] = useState<JobOpeningForm>(initialForm)
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchOpening = useCallback(async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data, error: fetchError } = await supabase
        .from('job_openings')
        .select('*')
        .eq('id', params.id)
        .single()

      if (fetchError || !data) {
        router.push('/admin/job-openings')
        return
      }

      setForm({
        title: data.title,
        department: data.department || '',
        location: data.location || '',
        experience: data.experience || '',
        employment_type: data.employment_type || 'full-time',
        description: data.description || '',
        tech_stack: data.tech_stack || [],
        display_order: data.display_order,
        status: data.status,
      })
    } catch (err) {
      console.error('Error fetching job opening:', err)
      setError('Failed to load job opening')
    } finally {
      setLoading(false)
    }
  }, [params.id, router])

  useEffect(() => {
    if (!isNew) {
      fetchOpening()
    }
  }, [isNew, fetchOpening])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSaving(true)

    const supabase = createClient()

    const payload = {
      title: form.title,
      department: form.department || null,
      location: form.location || null,
      experience: form.experience || null,
      employment_type: form.employment_type,
      description: form.description || null,
      tech_stack: form.tech_stack,
      display_order: form.display_order,
      status: form.status,
    }

    if (isNew) {
      const { error } = await supabase.from('job_openings').insert(payload)
      if (error) {
        setError(error.message)
        setSaving(false)
        return
      }
    } else {
      const { error } = await supabase
        .from('job_openings')
        .update(payload)
        .eq('id', params.id)
      if (error) {
        setError(error.message)
        setSaving(false)
        return
      }
    }

    router.push('/admin/job-openings')
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
          href="/admin/job-openings"
          className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 mb-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Job Openings
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          {isNew ? 'Add Job Opening' : 'Edit Job Opening'}
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
          label="Job Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
          placeholder="e.g. Senior Full Stack Developer"
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Department"
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
            placeholder="e.g. Engineering"
          />
          <Input
            label="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            placeholder="e.g. Pune / Remote"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Experience"
            value={form.experience}
            onChange={(e) => setForm({ ...form, experience: e.target.value })}
            placeholder="e.g. 5-8 years"
          />
          <Select
            label="Employment Type"
            value={form.employment_type}
            onChange={(e) => setForm({ ...form, employment_type: e.target.value })}
            options={[
              { value: 'full-time', label: 'Full-time' },
              { value: 'part-time', label: 'Part-time' },
              { value: 'contract', label: 'Contract' },
            ]}
          />
        </div>

        <Textarea
          label="Job Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Describe the role, responsibilities, and requirements..."
          rows={6}
        />

        <TagInput
          label="Tech Stack"
          value={form.tech_stack}
          onChange={(tags) => setForm({ ...form, tech_stack: tags })}
          placeholder="e.g. React, Node.js, TypeScript..."
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
              { value: 'closed', label: 'Closed' },
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
            {saving ? 'Saving...' : isNew ? 'Create Opening' : 'Save Changes'}
          </button>
          <Link
            href="/admin/job-openings"
            className="px-6 py-2 text-gray-700 hover:text-gray-900"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
