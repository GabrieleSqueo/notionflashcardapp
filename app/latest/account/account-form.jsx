'use client'
import { useCallback, useEffect, useState } from 'react'
import { createClient } from '../../utils/supabase/client'
import Avatar from './avatar'

export default function AccountForm({ user }) {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState({
    username: ''
  })
  const [isMounted, setIsMounted] = useState(false)

  const getProfile = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('profiles')
        .select(`username`)
        .eq('id', user?.id)
        .single()

      if (error) throw error
      setProfile({
        username: data.username || ''
      })
    } catch (error) {
      console.error('Error loading user data:', error.message)
    } finally {
      setLoading(false)
    }
  }, [user, supabase])

  useEffect(() => {
    getProfile()
  }, [getProfile])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setProfile(prev => ({ ...prev, [name]: value }))
  }

  const updateProfile = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const { error } = await supabase.from('profiles').upsert({
        id: user?.id,
        username: profile.username,
        updated_at: new Date().toISOString(),
      })
      if (error) throw error
      alert('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error.message)
      alert('Error updating profile: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  if (!isMounted) {
    return null
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Your Profile</h2>
        <Avatar
          uid={user?.id}
          url={profile.avatar_url}
          size={150}
          onUpload={(url) => setProfile(prev => ({ ...prev, avatar_url: url }))}
        />
        <form onSubmit={updateProfile} className="space-y-4 mt-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input id="email" type="text" value={user?.email} disabled className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm text-gray-500" />
          </div>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              value={profile.username}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
            />
          </div>
          <div className="flex justify-between items-center mt-6">
            <button
              type="submit"
              className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
            <form action="/auth/signout" method="post">
              <button type="submit" className="text-sm text-red-600 hover:text-red-800">
                Sign out
              </button>
            </form>
          </div>
        </form>
      </div>
    </div>
  )
}