'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { StatusBadge, Select, Textarea } from '@/components/admin/FormFields'

interface ClientInquiry {
  id: string
  company_name: string
  contact_name: string
  email: string
  phone: string | null
  service_interest_other: string | null
  message: string
  status: string
  admin_notes: string | null
  created_at: string
  services: { title: string } | null
}

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<ClientInquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedInquiry, setSelectedInquiry] = useState<ClientInquiry | null>(null)
  const [adminNotes, setAdminNotes] = useState('')
  const [saving, setSaving] = useState(false)

  const fetchInquiries = async () => {
    setLoading(true)
    const supabase = createClient()
    const { data } = await supabase
      .from('client_inquiries')
      .select('*, services(title)')
      .order('created_at', { ascending: false })

    setInquiries(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchInquiries()
  }, [])

  const updateStatus = async (id: string, status: string) => {
    const supabase = createClient()
    await supabase.from('client_inquiries').update({ status }).eq('id', id)
    fetchInquiries()
  }

  const saveNotes = async () => {
    if (!selectedInquiry) return
    setSaving(true)
    const supabase = createClient()
    await supabase.from('client_inquiries').update({ admin_notes: adminNotes }).eq('id', selectedInquiry.id)
    setSelectedInquiry({ ...selectedInquiry, admin_notes: adminNotes })
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return
    const supabase = createClient()
    await supabase.from('client_inquiries').delete().eq('id', id)
    if (selectedInquiry?.id === id) setSelectedInquiry(null)
    fetchInquiries()
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
          <h1 className="text-2xl font-bold text-gray-900">Client Inquiries</h1>
          <p className="text-gray-600">Manage inquiries from potential clients</p>
        </div>
        <button
          onClick={fetchInquiries}
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
        {/* Inquiry List */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm">
          {inquiries.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No inquiries yet</div>
          ) : (
            <div className="divide-y divide-gray-200">
              {inquiries.map((inquiry) => (
                <div
                  key={inquiry.id}
                  onClick={() => {
                    setSelectedInquiry(inquiry)
                    setAdminNotes(inquiry.admin_notes || '')
                  }}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedInquiry?.id === inquiry.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{inquiry.contact_name}</p>
                      <p className="text-sm text-gray-500">{inquiry.company_name}</p>
                      <p className="text-xs text-gray-400">{inquiry.email}</p>
                    </div>
                    <div className="text-right">
                      <StatusBadge status={inquiry.status} type="submission" />
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(inquiry.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 truncate">{inquiry.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detail Panel */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          {selectedInquiry ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Inquiry Details</h3>
                <button
                  onClick={() => handleDelete(selectedInquiry.id)}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-500">Contact:</span>
                  <p className="font-medium">{selectedInquiry.contact_name}</p>
                </div>
                <div>
                  <span className="text-gray-500">Company:</span>
                  <p className="font-medium">{selectedInquiry.company_name}</p>
                </div>
                <div>
                  <span className="text-gray-500">Email:</span>
                  <p className="font-medium">
                    <a href={`mailto:${selectedInquiry.email}`} className="text-blue-600 hover:underline">
                      {selectedInquiry.email}
                    </a>
                  </p>
                </div>
                {selectedInquiry.phone && (
                  <div>
                    <span className="text-gray-500">Phone:</span>
                    <p className="font-medium">{selectedInquiry.phone}</p>
                  </div>
                )}
                <div>
                  <span className="text-gray-500">Service Interest:</span>
                  <p className="font-medium">
                    {selectedInquiry.services?.title || selectedInquiry.service_interest_other || 'General Inquiry'}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Message:</span>
                  <p className="mt-1 text-gray-700 whitespace-pre-wrap">{selectedInquiry.message}</p>
                </div>
                <div>
                  <span className="text-gray-500">Received:</span>
                  <p className="font-medium">{new Date(selectedInquiry.created_at).toLocaleString()}</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Select
                  label="Status"
                  value={selectedInquiry.status}
                  onChange={(e) => updateStatus(selectedInquiry.id, e.target.value)}
                  options={[
                    { value: 'new', label: 'New' },
                    { value: 'contacted', label: 'Contacted' },
                    { value: 'qualified', label: 'Qualified' },
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
                  placeholder="Internal notes about this inquiry..."
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
              Select an inquiry to view details
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
