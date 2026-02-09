'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { StatusBadge, Select, Textarea } from '@/components/admin/FormFields'

interface GeneralApplication {
  id: string
  name: string
  email: string
  phone: string | null
  linkedin_url: string | null
  role_interest: string | null
  message: string
  status: string
  admin_notes: string | null
  created_at: string
  job_opening_id: string | null
  job_openings: { title: string } | null
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<GeneralApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedApp, setSelectedApp] = useState<GeneralApplication | null>(null)
  const [adminNotes, setAdminNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'job' | 'general'>('all')

  const fetchApplications = async () => {
    setLoading(true)
    const supabase = createClient()
    const { data } = await supabase
      .from('general_applications')
      .select('*, job_openings(title)')
      .order('created_at', { ascending: false })

    setApplications(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchApplications()
  }, [])

  const updateStatus = async (id: string, status: string) => {
    const supabase = createClient()
    await supabase.from('general_applications').update({ status }).eq('id', id)
    fetchApplications()
  }

  const saveNotes = async () => {
    if (!selectedApp) return
    setSaving(true)
    const supabase = createClient()
    await supabase.from('general_applications').update({ admin_notes: adminNotes }).eq('id', selectedApp.id)
    setSelectedApp({ ...selectedApp, admin_notes: adminNotes })
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this application?')) return
    const supabase = createClient()
    await supabase.from('general_applications').delete().eq('id', id)
    if (selectedApp?.id === id) setSelectedApp(null)
    fetchApplications()
  }

  const filteredApplications = applications.filter((app) => {
    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      const matchesSearch =
        app.name.toLowerCase().includes(query) ||
        app.email.toLowerCase().includes(query) ||
        (app.job_openings?.title?.toLowerCase().includes(query) ?? false)
      if (!matchesSearch) return false
    }
    // Status filter
    if (statusFilter && app.status !== statusFilter) return false
    // Type filter
    if (typeFilter === 'job' && !app.job_opening_id) return false
    if (typeFilter === 'general' && app.job_opening_id) return false
    return true
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#FF000E] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
          <p className="text-gray-600">Manage job applications from careers page and general submissions</p>
        </div>
        <button
          onClick={fetchApplications}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <svg
            className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, or job title..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF000E] focus:border-transparent text-sm"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF000E] text-sm"
        >
          <option value="">All Statuses</option>
          <option value="new">New</option>
          <option value="reviewed">Reviewed</option>
          <option value="shortlisted">Shortlisted</option>
          <option value="closed">Closed</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as 'all' | 'job' | 'general')}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF000E] text-sm"
        >
          <option value="all">All Types</option>
          <option value="job">Job Applications</option>
          <option value="general">General Applications</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Application List */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm">
          {filteredApplications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {applications.length === 0 ? 'No applications yet' : 'No applications match your filters'}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredApplications.map((app) => (
                <div
                  key={app.id}
                  onClick={() => {
                    setSelectedApp(app)
                    setAdminNotes(app.admin_notes || '')
                  }}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedApp?.id === app.id ? 'bg-green-50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{app.name}</p>
                      {app.job_openings?.title ? (
                        <p className="text-xs mt-0.5">
                          <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                            Applied for: {app.job_openings.title}
                          </span>
                        </p>
                      ) : (
                        <p className="text-xs mt-0.5">
                          <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-50 text-gray-600">
                            General Application
                          </span>
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-0.5">{app.email}</p>
                    </div>
                    <div className="text-right">
                      <StatusBadge status={app.status} type="submission" />
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(app.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 truncate">{app.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detail Panel */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          {selectedApp ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Application Details</h3>
                <button
                  onClick={() => handleDelete(selectedApp.id)}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-500">Name:</span>
                  <p className="font-medium">{selectedApp.name}</p>
                </div>
                <div>
                  <span className="text-gray-500">Email:</span>
                  <p className="font-medium">
                    <a href={`mailto:${selectedApp.email}`} className="text-blue-600 hover:underline">
                      {selectedApp.email}
                    </a>
                  </p>
                </div>
                {selectedApp.phone && (
                  <div>
                    <span className="text-gray-500">Phone:</span>
                    <p className="font-medium">{selectedApp.phone}</p>
                  </div>
                )}
                {selectedApp.linkedin_url && (
                  <div>
                    <span className="text-gray-500">LinkedIn:</span>
                    <p className="font-medium">
                      <a href={selectedApp.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        View Profile
                      </a>
                    </p>
                  </div>
                )}
                <div>
                  <span className="text-gray-500">Applied For:</span>
                  {selectedApp.job_openings?.title ? (
                    <p className="font-medium text-blue-700">{selectedApp.job_openings.title}</p>
                  ) : (
                    <p className="font-medium text-gray-500">General Application</p>
                  )}
                </div>
                {selectedApp.role_interest && (
                  <div>
                    <span className="text-gray-500">Role Interest:</span>
                    <p className="font-medium">{selectedApp.role_interest}</p>
                  </div>
                )}
                <div>
                  <span className="text-gray-500">Message:</span>
                  <p className="mt-1 text-gray-700 whitespace-pre-wrap">{selectedApp.message}</p>
                </div>
                <div>
                  <span className="text-gray-500">Applied:</span>
                  <p className="font-medium">{new Date(selectedApp.created_at).toLocaleString()}</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Select
                  label="Status"
                  value={selectedApp.status}
                  onChange={(e) => updateStatus(selectedApp.id, e.target.value)}
                  options={[
                    { value: 'new', label: 'New' },
                    { value: 'reviewed', label: 'Reviewed' },
                    { value: 'shortlisted', label: 'Shortlisted' },
                    { value: 'closed', label: 'Closed' },
                  ]}
                />
              </div>

              <div className="pt-4 border-t">
                <Textarea
                  label="Admin Notes"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={4}
                  placeholder="Internal notes about this applicant..."
                />
                <button
                  onClick={saveNotes}
                  disabled={saving}
                  className="mt-2 px-4 py-2 bg-gray-900 text-white text-sm rounded hover:bg-gray-800 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Notes'}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              Select an application to view details
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
