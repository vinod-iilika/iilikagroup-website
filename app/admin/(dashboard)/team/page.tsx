'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import DataTable from '@/components/admin/DataTable'
import { StatusBadge } from '@/components/admin/FormFields'

interface TeamMember {
  id: string
  name: string
  position: string
  department: string | null
  photo_url: string | null
  is_author: boolean
  display_order: number
  status: string
}

export default function TeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)

  const fetchTeam = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('team_members')
      .select('*')
      .order('display_order', { ascending: true })

    setTeam(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchTeam()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this team member?')) return
    const supabase = createClient()
    await supabase.from('team_members').delete().eq('id', id)
    fetchTeam()
  }

  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (item: TeamMember) => (
        <div className="flex items-center gap-3">
          {item.photo_url ? (
            <img src={item.photo_url} alt="" className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
              {item.name.charAt(0)}
            </div>
          )}
          <div>
            <p className="font-medium">{item.name}</p>
            <p className="text-xs text-gray-500">{item.position}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'department',
      label: 'Department',
      render: (item: TeamMember) => item.department || '-',
    },
    {
      key: 'is_author',
      label: 'Author',
      render: (item: TeamMember) => item.is_author ? '✓' : '-',
    },
    {
      key: 'display_order',
      label: 'Order',
    },
    {
      key: 'status',
      label: 'Status',
      render: (item: TeamMember) => <StatusBadge status={item.status} />,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Members</h1>
          <p className="text-gray-600">Manage team bios and blog authors</p>
        </div>
        <Link
          href="/admin/team/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF000E] text-white rounded hover:bg-[#9E0008] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Team Member
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={team}
        basePath="/admin/team"
        onDelete={handleDelete}
        loading={loading}
      />
    </div>
  )
}
