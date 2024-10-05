'use client'

import React, { useState, Suspense, useEffect } from 'react'
import { login } from './actions'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { MdLock } from 'react-icons/md'
import { createClient } from '../../utils/supabase/client'

function LoginForm() {
  const [error, setError] = useState(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const fromEmbed = searchParams.get('from_embed')

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        router.push('/latest')
      }
    }
    checkAuth()
  }, [router])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError(null)

    const formData = new FormData(event.target)
    try {
      await login(formData)
      if (fromEmbed) {
        router.push(`/embed/${fromEmbed}`)
      } else {
        router.push('/latest')
      }
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white shadow-lg rounded-xl p-8">
        <div>
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100">
            <MdLock className="h-8 w-8 text-indigo-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-t-xl relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-b-xl relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm mt-2 bg-red-100 border border-red-400 rounded-lg p-3">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              className="w-full flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-xl shadow-[0_3px_0_rgb(67,56,202)] text-sm font-bold transition-all duration-150 active:shadow-[0_0_0_rgb(67,56,202)] active:translate-y-[3px] hover:bg-indigo-700"
            >
              Sign in
            </button>
          </div>
        </form>
        <div className="text-center space-y-4">
          <Link href="/latest/signup" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
            Don't have an account? Sign up
          </Link>
          <div>
            <Link href="/" className="font-medium text-gray-600 hover:text-gray-500 transition-colors duration-200">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  )
}