'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

interface StorageFile {
  name: string
  id: string
  bucket: string
  created_at: string
  metadata: {
    size: number
    mimetype: string
  }
}

interface BucketStats {
  name: string
  fileCount: number
  totalSize: number
}

const BUCKETS = ['logos', 'team', 'products', 'insights', 'case-studies']

export default function StoragePage() {
  const [bucketStats, setBucketStats] = useState<BucketStats[]>([])
  const [selectedBucket, setSelectedBucket] = useState<string | null>(null)
  const [files, setFiles] = useState<StorageFile[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchBucketStats = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const stats: BucketStats[] = []

      for (const bucket of BUCKETS) {
        const { data } = await supabase.storage.from(bucket).list()
        const totalSize = data?.reduce((acc: number, file: { metadata?: { size?: number } }) => acc + (file.metadata?.size || 0), 0) || 0
        stats.push({
          name: bucket,
          fileCount: data?.length || 0,
          totalSize,
        })
      }

      setBucketStats(stats)
    } catch (err) {
      console.error('Error fetching bucket stats:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBucketStats()
  }, [])

  const fetchBucketFiles = async (bucket: string) => {
    setSelectedBucket(bucket)
    const supabase = createClient()
    const { data } = await supabase.storage.from(bucket).list()

    const filesWithBucket = (data || []).map((file) => ({
      ...file,
      bucket,
      metadata: file.metadata as { size: number; mimetype: string },
    }))

    setFiles(filesWithBucket)
  }

  const getPublicUrl = (bucket: string, fileName: string) => {
    const supabase = createClient()
    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName)
    return data.publicUrl
  }

  const handleDelete = async (bucket: string, fileName: string) => {
    if (!confirm(`Are you sure you want to delete ${fileName}?`)) return

    setDeleting(fileName)
    const supabase = createClient()
    await supabase.storage.from(bucket).remove([fileName])

    // Refresh files
    await fetchBucketFiles(bucket)
    await fetchBucketStats()
    setDeleting(null)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#FF000E] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  const totalFiles = bucketStats.reduce((acc, b) => acc + b.fileCount, 0)
  const totalSize = bucketStats.reduce((acc, b) => acc + b.totalSize, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Storage Management</h1>
          <p className="text-gray-600">Manage uploaded files and clean up orphaned files</p>
        </div>
        <button
          onClick={fetchBucketStats}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-500">Total Files</p>
          <p className="text-2xl font-bold">{totalFiles}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-500">Total Size</p>
          <p className="text-2xl font-bold">{formatFileSize(totalSize)}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-500">Buckets</p>
          <p className="text-2xl font-bold">{BUCKETS.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-500">Storage Limit</p>
          <p className="text-2xl font-bold">1 GB</p>
          <p className="text-xs text-gray-400">{((totalSize / (1024 * 1024 * 1024)) * 100).toFixed(2)}% used</p>
        </div>
      </div>

      {/* Bucket List */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Storage Buckets</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {bucketStats.map((bucket) => (
            <div
              key={bucket.name}
              onClick={() => fetchBucketFiles(bucket.name)}
              className={`p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedBucket === bucket.name ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{bucket.name}</p>
                  <p className="text-sm text-gray-500">{bucket.fileCount} files</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{formatFileSize(bucket.totalSize)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Files in Selected Bucket */}
      {selectedBucket && (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Files in {selectedBucket}</h2>
            <button
              onClick={() => setSelectedBucket(null)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Close
            </button>
          </div>

          {files.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No files in this bucket</div>
          ) : (
            <div className="divide-y divide-gray-200">
              {files.map((file) => (
                <div key={file.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {file.metadata?.mimetype?.startsWith('image/') ? (
                      <img
                        src={getPublicUrl(selectedBucket, file.name)}
                        alt={file.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900 text-sm truncate max-w-xs">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.metadata?.size || 0)} • {new Date(file.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={getPublicUrl(selectedBucket, file.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      View
                    </a>
                    <button
                      onClick={() => handleDelete(selectedBucket, file.name)}
                      disabled={deleting === file.name}
                      className="text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
                    >
                      {deleting === file.name ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Usage Warning */}
      {totalSize > 800 * 1024 * 1024 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="font-medium text-yellow-800">Storage Warning</p>
              <p className="text-sm text-yellow-700">
                You are using over 80% of your free storage limit. Consider deleting unused files or upgrading your plan.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
