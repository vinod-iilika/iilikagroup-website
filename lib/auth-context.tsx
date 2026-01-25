'use client'

import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useMemo, useRef } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase'

interface AdminProfile {
  id: string
  email: string
  full_name: string
  role: 'super_admin' | 'admin' | 'hr' | 'sales'
  avatar_url: string | null
}

interface AuthContextType {
  user: User | null
  adminProfile: AdminProfile | null
  loading: boolean
  signOut: () => Promise<void>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  adminProfile: null,
  loading: true,
  signOut: async () => {},
  refreshSession: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null)
  const [loading, setLoading] = useState(true)

  // Use ref to track refresh state without causing re-renders
  const isRefreshingRef = useRef(false)

  // Use memoized supabase client to ensure stable reference
  const supabase = useMemo(() => createClient(), [])

  // Function to fetch session and profile
  const fetchSession = useCallback(async (showLoading = true) => {
    // Prevent multiple simultaneous fetches
    if (isRefreshingRef.current) return

    if (showLoading) setLoading(true)
    isRefreshingRef.current = true

    try {
      const { data: { user: fetchedUser } } = await supabase.auth.getUser()

      if (fetchedUser) {
        setUser(fetchedUser)

        const { data: profile } = await supabase
          .from('admin_profiles')
          .select('*')
          .eq('id', fetchedUser.id)
          .single()

        setAdminProfile(profile)
      }
      // Don't clear user if fetch returns null - might be a temporary network issue
      // Only onAuthStateChange SIGNED_OUT should clear the user
    } catch (error) {
      console.error('Error fetching session:', error)
      // Don't clear user on error - keep existing state
    } finally {
      setLoading(false)
      isRefreshingRef.current = false
    }
  }, [supabase])

  // Refresh session (can be called manually)
  const refreshSession = useCallback(async () => {
    if (!isRefreshingRef.current) {
      await fetchSession(false)
    }
  }, [fetchSession])

  useEffect(() => {
    // Get initial session
    fetchSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Only clear user state on explicit sign out
        if (event === 'SIGNED_OUT') {
          setUser(null)
          setAdminProfile(null)
          setLoading(false)
          return
        }

        // For all other events, only update if we have a valid session
        if (session?.user) {
          setUser(session.user)

          const { data: profile } = await supabase
            .from('admin_profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()

          setAdminProfile(profile)
        }

        setLoading(false)
      }
    )

    // Handle tab visibility change - refresh session when tab becomes visible
    // Use debounce to prevent rapid-fire refreshes
    let visibilityTimeout: NodeJS.Timeout | null = null

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Clear any pending refresh
        if (visibilityTimeout) {
          clearTimeout(visibilityTimeout)
        }
        // Debounce the refresh by 100ms
        visibilityTimeout = setTimeout(() => {
          refreshSession()
        }, 100)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      subscription.unsubscribe()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      if (visibilityTimeout) {
        clearTimeout(visibilityTimeout)
      }
    }
  }, [fetchSession, refreshSession, supabase])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    setUser(null)
    setAdminProfile(null)
  }, [supabase])

  return (
    <AuthContext.Provider value={{ user, adminProfile, loading, signOut, refreshSession }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
