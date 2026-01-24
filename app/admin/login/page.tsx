'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  const unauthorizedError = searchParams.get('error') === 'unauthorized'

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    // Successful login - middleware will handle admin check
    router.push('/admin')
    router.refresh()
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      {/* Logo/Brand */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">IILIKA GROUPS</h1>
        <p className="text-gray-600 mt-2">Admin Panel</p>
      </div>

      {/* Error Messages */}
      {unauthorizedError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          You do not have admin access. Please contact the administrator.
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#FF000E] focus:border-transparent outline-none transition-all"
            placeholder="admin@iilikagroups.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#FF000E] focus:border-transparent outline-none transition-all"
            placeholder="Enter your password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#FF000E] text-white py-3 rounded font-semibold hover:bg-[#9E0008] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      {/* Back to Site */}
      <div className="mt-6 text-center">
        <a href="/" className="text-sm text-gray-500 hover:text-gray-700">
          &larr; Back to website
        </a>
      </div>
    </div>
  )
}

function LoginFormFallback() {
  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">IILIKA GROUPS</h1>
        <p className="text-gray-600 mt-2">Admin Panel</p>
      </div>
      <div className="flex items-center justify-center py-8">
        <div className="w-8 h-8 border-4 border-[#FF000E] border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <Suspense fallback={<LoginFormFallback />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
