'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js'
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
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  adminProfile: null,
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null)

  useEffect(() => {
    const supabase = createClient()

    // Get initial session - non-blocking
    supabase.auth.getSession().then(({ data }: { data: { session: Session | null } }) => {
      if (data.session?.user) {
        setUser(data.session.user)
        // Fetch profile
        supabase
          .from('admin_profiles')
          .select('*')
          .eq('id', data.session.user.id)
          .single()
          .then(({ data: profile }: { data: AdminProfile | null }) => {
            if (profile) setAdminProfile(profile)
          })
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        if (event === 'SIGNED_OUT') {
          setUser(null)
          setAdminProfile(null)
        } else if (session?.user) {
          setUser(session.user)
          supabase
            .from('admin_profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
            .then(({ data: profile }: { data: AdminProfile | null }) => {
              if (profile) setAdminProfile(profile)
            })
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    setAdminProfile(null)
  }

  return (
    <AuthContext.Provider value={{ user, adminProfile, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
