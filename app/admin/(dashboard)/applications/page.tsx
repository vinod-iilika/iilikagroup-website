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
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<GeneralApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedApp, setSelectedApp] = useState<GeneralApplication | null>(null)
  const [adminNotes, setAdminNotes] = useState('')
  const [saving, setSaving] = useState(false)

  const fetchApplications = async () => {
    setLoading(true)
    const supabase = createClient()
    const { data } = await supabase
      .from('general_applications')
      .select('*')
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
          <h1 className="text-2xl font-bold text-gray-900">General Applications</h1>
          <p className="text-gray-600">Manage general job applications from the contact page</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Application List */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm">
          {applications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No applications yet</div>
          ) : (
            <div className="divide-y divide-gray-200">
              {applications.map((app) => (
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
                      <p className="text-sm text-gray-500">{app.role_interest || 'General Interest'}</p>
                      <p className="text-xs text-gray-400">{app.email}</p>
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
                  <span className="text-gray-500">Role Interest:</span>
                  <p className="font-medium">{selectedApp.role_interest || 'General Interest'}</p>
                </div>
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
